#!/bin/bash -e
cd $(dirname $0)
SOURCE_DIR=$(pwd)/third_party/ffmpeg
OUT_DIR=$(pwd)/vendor/ffmpeg
OPTIONS="--disable-all --disable-everything --disable-debug --disable-autodetect --enable-small \
        --enable-avcodec --enable-decoder=h264"


function make_dir() {
  rm -rf $1
  mkdir -p $1
}



find_ndk() {
  for NDK in $NDK_HOME $NDK_PATH $ANDROID_NDK_HOME $ANDROID_NDK; do
    if [ -f "$NDK/ndk-build" ]; then
      echo $NDK
      return
    fi
  done
  ANDROID_HOME=$HOME/Library/Android/sdk
  if [ -f "$ANDROID_HOME/ndk-bundle/ndk-build" ]; then
    echo $ANDROID_HOME/ndk-bundle
    return
  fi

  if [ -d "$ANDROID_HOME/ndk" ]; then
    for file in $ANDROID_HOME/ndk/*; do
      if [ -f "$file/ndk-build" ]; then
        echo $file
        return
      fi
    done
  fi
}

build_arch() {
  ./configure --target-os=android --enable-cross-compile --cc=$CC --arch=$ARCH --cpu=${CPU} $OPTIONS \
    --cross-prefix=${CROSS_PREFIX} --sysroot=${SYSROOT} --extra-cflags="-w -fvisibility=hidden" \
    --prefix=$OUT_DIR/android/$ARCH
  make -j12
  make install
  make clean
}

NDK_HOME=$(find_ndk)
if ! [ -d "$NDK_HOME" ]; then
  echo "Could not find the NDK_HOME!"
  exit 1
fi
echo "NDK_HOME: $NDK_HOME"
TOOLCHAIN=$NDK_HOME/toolchains/llvm/prebuilt/linux-x86_64
SYSROOT=$TOOLCHAIN/sysroot


# build android
cd $SOURCE_DIR
rm -rf $OUT_DIR/android

# build arm64
ARCH="arm64"
CPU="armv8-a"
CROSS_PREFIX=$TOOLCHAIN/bin/llvm-
CC=$TOOLCHAIN/bin/aarch64-linux-android21-clang
build_arch

# build armv7
ARCH="arm"
CPU="armv7-a"
CROSS_PREFIX=$TOOLCHAIN/bin/llvm-
CC=$TOOLCHAIN/bin/armv7a-linux-androideabi21-clang
build_arch

# build x86_64
ARCH="x86_64"
CPU="x86"
CROSS_PREFIX=$TOOLCHAIN/bin/llvm-
CC=$TOOLCHAIN/bin/x86_64-linux-android21-clang
AR=$TOOLCHAIN/bin/llvm-ar
NM=$TOOLCHAIN/bin/llvm-nm
build_arch

#rm -rf $SOURCE_DIR/out
cd ../../
exit 0

