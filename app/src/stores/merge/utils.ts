const hasDefault = (value: any, dflt: any = null) =>
  value !== dflt ? value : undefined;

const createPayloadModel = (model: any) =>
  model.weight !== undefined
    ? { model: model.id, weight: model.weight }
    : { model: model.id };

const formatModels = (
  baseModel: any,
  models: any,
  baseModelWeight: number,
  modelsWeights: any[]
) => {
  let parsedModels = [];
  let parsedBaseModel = null;

  // TODO: Error validations and UI messages - when models < 2
  if (baseModel) {
    parsedBaseModel = baseModel.id;
    parsedModels.push(
      createPayloadModel({ ...baseModel, weight: baseModelWeight })
    );
  }

  // not just the default [{}]
  if (!(models.length === 1 && Object.keys(models[0]).length === 0)) {
    models.forEach((model: any, key: number) => {
      // first object is the default empty {}
      if (Object.keys(model).length !== 0) {
        parsedModels.push(
          createPayloadModel({ ...model, weight: modelsWeights[key] })
        );
      }
    });
  }

  return [parsedBaseModel, parsedModels];
};

export { formatModels, createPayloadModel, hasDefault };
