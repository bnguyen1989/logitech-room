export enum NODE_TYPE {
  // camera = 'Camera',
  image = 'Image',
  item = 'Item',
  light = 'Light',
  material = 'Material',
  materialLibrary = 'MaterialLibrary',
  model = 'Model',
  null = 'Null',
  objects = 'Objects',
  polyMesh = 'PolyMesh',
  scene = 'Scene',
  // stage = 'Stage',
  annotation = 'Annotation',
  connector = 'Connector'
}

export enum OPERATOR_SET_TYPES {
  null = 'Null',
  properties = 'Properties',
  transform = 'Transform',
  environment = 'Environment',
  player = 'Player',
  postEffect = 'PostEffect',
  renderSettings = 'RenderSettings',
  proxy = 'Proxy',
  light = 'Light',
  objects = 'Objects',
  annotation = 'Annotation',
  image = 'Image',
  material = 'Material',
  polyMesh = 'PolyMesh',
  connector = 'Connector',
  mixer = 'Mixer'
}

export enum PROPERTY_TYPE {
  proxy = 'Proxy',
  mixer = 'Mixer',
  model = 'Model',
  modelProperties = 'ModelProperties',
  transform = 'Transform',
  mesh = 'Mesh',
  image = 'Image',
  imageProperties = 'ImageProperties',
  box = 'Box',
  sphere = 'Sphere',
  polyMeshProperties = 'PolyMeshProperties',
  objects = 'Objects',
  null = 'Null',
  default = 'Default',
  postEffect = 'PostEffect',
  environment = 'Environment',
  reference = 'Reference',
  material = 'Physical',
  materialProperties = 'MaterialProperties',
  environmentOverride = 'EnvironmentOverride',
  physical = 'Physical',
  areaLight = 'AreaLight',
  directionalLight = 'DirectionalLight',
  pointLight = 'PointLight',
  hemisphereLight = 'HemisphereLight',
  spotLight = 'SpotLight',
  tilingOverride = 'TilingOverride',
  annotation = 'Annotation',
  connector = 'Connector'
}

export enum ATTRIBUTE_TYPE {
  global = 'Global',
  asset = 'Asset',
  string = 'String',
  number = 'Number',
  color = 'Color',
  boolean = 'Boolean',
  pricing = 'Pricing'
}

export enum ASSET_TYPE {
  model = 'model',
  material = 'material'
}

export enum COMPARATORS {
  equal = '==',
  equalAlt = '=',
  notEqual = '!=',
  metadata = 'metadata',
  hasChanged = 'changed',
  includes = 'includes',
  excludes = 'excludes'
}

export enum RULE_ACTION {
  setAttributeVisible = 'set-attribute-visible',
  setAttributeEnabled = 'set-attribute-enabled',
  setAttributeValueVisibility = 'set-attribute-value-visibility',
  setAttributeValueEnabled = 'set-attribute-value-enabled'
}
