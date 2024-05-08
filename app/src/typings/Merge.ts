type Merge = {
  merge_name: string;
  uuid?: string;
  merge_date?: string;
  output_dir_path?: string;
  log_stream?: string;
  merge_config?: string;
};

type PathOrID = string;

type MergeMethod =
  | "addition-task-arithmetic"
  | "ties-merging"
  | "slerp"
  | "dare-ties-merging"
  | "model-soup" //Linear
  | "passthrough";

type ModelConfig = {
  model: string;
  weight?: number;
};

type TokenizerConfig = {
  mode?: string;
  interpolation_method?: string;
};

type LinearMerge = {
  scaling_coefficient?: number;
  normalize?: boolean;
  top_k?: number;
};

type TaskArithmeticAdditionMerge = {
  scaling_coefficient?: number;
  normalize?: boolean;
};

type DareTiesMerge = {
  scaling_coefficient?: number;
  normalize?: boolean;
  p?: number;
};

type TiesMerge = {
  scaling_coefficient?: number;
  normalize?: boolean;
  top_k?: number;
};

type SlerpMerge = {
  t?: number;
};

type MethodConfig =
  | TiesMerge
  | DareTiesMerge
  | LinearMerge
  | TaskArithmeticAdditionMerge
  | SlerpMerge;

type MergeConfig = {
  method: MergeMethod;
  method_global_parameters: MethodConfig;
  base_model: PathOrID;
  models: ModelConfig[];
  tokenizer_config: TokenizerConfig;
};

export { MergeConfig, MethodConfig, TokenizerConfig, ModelConfig, MergeMethod };
