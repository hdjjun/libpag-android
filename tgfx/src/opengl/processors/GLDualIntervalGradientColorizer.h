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

#pragma once

#include <optional>
#include "gpu/processors/DualIntervalGradientColorizer.h"
#include "tgfx/core/Color.h"

namespace tgfx {
class GLDualIntervalGradientColorizer : public DualIntervalGradientColorizer {
 public:
  GLDualIntervalGradientColorizer(Color scale01, Color bias01, Color scale23, Color bias23,
                                  float threshold);

  void emitCode(EmitArgs& args) const override;

 private:
  void onSetData(UniformBuffer*) const override;
};
}  // namespace tgfx
