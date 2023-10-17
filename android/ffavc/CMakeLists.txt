cmake_minimum_required(VERSION 3.1)
project(ffavc)

# Options for building ffavc
if (EMSCRIPTEN)
    option(FFAVC_BUILD_STATIC "Build static lib" ON)
else ()
    option(FFAVC_BUILD_STATIC "Build static lib" OFF)
endif ()

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
#set(CMAKE_VERBOSE_MAKEFILE ON)


if (CMAKE_SYSTEM_PROCESSOR STREQUAL "aarch64")
    if (SDK_NAME STREQUAL iphonesimulator)
        set(ARCH arm64-simulator)
    else ()
        set(ARCH arm64)
    endif ()
elseif (CMAKE_SYSTEM_PROCESSOR STREQUAL "x86_64")
    set(ARCH x86_64)
else ()
    set(ARCH arm)
endif ()

set(PLATFORM android)
set(ENV{NDK_HOME} ${ANDROID_NDK})

# Sets the default build type to release.
if (NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE "Release")
endif ()

if (CMAKE_CXX_COMPILER_ID MATCHES "Clang")
    add_definitions(-Werror -Wall -Wextra -Weffc++ -pedantic -Werror=return-type)
endif ()

if (MSVC)
    add_compile_options("/utf-8")
endif (MSVC)

# Sets flags
if (CMAKE_BUILD_TYPE STREQUAL "Debug")
    add_definitions(-DFFAVC_DEBUG)
endif ()

# collects include directories.
set(FFAVC_INCLUDES ../../ ../../include ../../src ../../vendor/ffmpeg/${PLATFORM}/${ARCH}/include)

# collects source files.
set(FFAVC_FILES ../../src/decoder/FFAVCDecoder.cpp)

add_compile_options(-fvisibility=hidden)

file(GLOB FFMPEG_FILES ../../vendor/ffmpeg/${PLATFORM}/${ARCH}/lib/*${CMAKE_STATIC_LIBRARY_SUFFIX})
list(APPEND FFAVC_VENDOR_LIBS ${FFMPEG_FILES})


#set(CMAKE_AR "/home/jame/Android/Sdk/ndk/25.1.8937393/toolchains/llvm/prebuilt/linux-x86_64/bin/llvm-ar")
# optimizes the output size
set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -Wl,--gc-sections -Wl,--version-script=${CMAKE_CURRENT_SOURCE_DIR}/export.def")
add_compile_options(-ffunction-sections -fdata-sections -Os -fno-exceptions -fno-rtti)

list(APPEND FFAVC_FILES ../../src/platform/android/JDecoderFactory.cpp)
find_library(LOG_LIB log)
list(APPEND FFAVC_VENDOR_LIBS ${LOG_LIB})


if (FFAVC_BUILD_STATIC)
    add_library(ffavc STATIC ${FFAVC_FILES})
else ()
    add_library(ffavc SHARED ${FFAVC_FILES})
endif ()
target_include_directories(ffavc PUBLIC ${FFAVC_INCLUDES})
target_link_libraries(ffavc ${FFAVC_VENDOR_LIBS})