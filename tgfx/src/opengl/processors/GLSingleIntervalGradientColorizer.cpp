/////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Tencent is pleased to support the open source community by making libpag available.
//
//  Copyright (C) 2021 THL A29 Limited, a Tencent company. All rights reserved.
//
//  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
//  except in compliance with the License. You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  unless required by applicable law or agreed to in writing, software distributed under the
//  license is distributed on an "as is" basis, without warranties or conditions of any kind,
//  either express or implied. see the license for the specific language governing permissions
//  and limitations under the license.
//
/////////////////////////////////////////////////////////////////////////////////////////////////

#include "GLSingleIntervalGradientColorizer.h"

namespace tgfx {
std::unique_ptr<SingleIntervalGradientColorizer> SingleIntervalGradientColorizer::Make(Color start,
                                                                                       Color end) {
  return std::unique_ptr<SingleIntervalGradientColorizer>(
      new GLSingleIntervalGradientColorizer(start, end));
}

GLSingleIntervalGradientColorizer::GLSingleIntervalGradientColorizer(Color start, Color end)
    : SingleIntervalGradientColorizer(start, end) {
}

void GLSingleIntervalGradientColorizer::emitCode(EmitArgs& args) const {
  auto* fragBuilder = args.fragBuilder;
  auto startName = args.uniformHandler->addUniform(ShaderFlags::Fragment, SLType::Float4, "start");
  auto endName = args.uniformHandler->addUniform(ShaderFlags::Fragment, SLType::Float4, "end");
  fragBuilder->codeAppendf("float t = %s.x;", args.inputColor.c_str());
  fragBuilder->codeAppendf("%s = (1.0 - t) * %s + t * %s;", args.outputColor.c_str(),
                           startName.c_str(), endName.c_str());
}

void GLSingleIntervalGradientColorizer::onSetData(UniformBuffer* uniformBuffer) const {
  uniformBuffer->setData("start", start);
  uniformBuffer->setData("end", end);
}
}  // namespace tgfx
