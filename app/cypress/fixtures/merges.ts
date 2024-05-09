export default [
  {
    merge_name: "asd",
    merge_date: "01.01.2024",
    output_dir_path: "/tmp/output",
    merge_config: JSON.stringify(
        {
          method: "method",
          method_global_parameters: { "top_k": 1.23, "scaling_coefficient": 3.21 },
          models: [{ model: "model 1" }, { model: "model 2" }, { model: "model 3" }],
          base_model: "base model",
          tokenizer_config: { mode: "tokenizer-mode", interpolation_method: "interpolation" }
        }
    )
  }
]
