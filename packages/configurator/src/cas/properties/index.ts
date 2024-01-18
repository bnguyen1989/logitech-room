import { z } from 'zod';

import { AnnotationProperty } from './Annotation.js';
import { AreaLightProperty } from './AreaLight.js';
import { BoxProperty } from './Box.js';
import { ConnectorProperty } from './Connector.js';
import { DefaultPropertiesProperty } from './DefaultProperties.js';
import { DirectionLightProperty } from './DirectionLight.js';
import { EnvironmentProperty } from './Environment.js';
import { EnvironmentOverrideProperty } from './EnvironmentOverride.js';
import { HemisphereLightProperty } from './HemisphereLight.js';
import { ImageProperty } from './Image.js';
import { ImagePropertiesProperty } from './ImageProperties.js';
import { MaterialProperty } from './Material.js';
import { MaterialPropertiesProperty } from './MaterialProperties.js';
import { MaterialReferenceProperty } from './MaterialReference.js';
import { MeshProperty } from './Mesh.js';
import { MixerProperty } from './Mixer.js';
import { ModelProperty } from './Model.js';
import { ModelPropertiesProperty } from './ModelProperties.js';
import { NullProperty } from './Null.js';
import { ObjectsProperty } from './Objects.js';
import { PointLightProperty } from './PointLight.js';
import { PolyMeshPropertiesProperty } from './PolyMeshProperties.js';
import { PostEffectProperty } from './PostEffect.js';
import { ProxyProperty } from './Proxy.js';
import { SphereProperty } from './Sphere.js';
import { SpotlightProperty } from './Spotlight.js';
import { TilingOverrideProperty } from './TilingOverride.js';
import { TransformProperty } from './Transform.js';

export const Property = z.union([
  AnnotationProperty,
  AreaLightProperty,
  BoxProperty,
  ConnectorProperty,
  DefaultPropertiesProperty,
  DirectionLightProperty,
  EnvironmentProperty,
  EnvironmentOverrideProperty,
  HemisphereLightProperty,
  ImageProperty,
  ImagePropertiesProperty,
  MaterialProperty,
  MaterialPropertiesProperty,
  MaterialReferenceProperty,
  MeshProperty,
  MixerProperty,
  ModelProperty,
  ModelPropertiesProperty,
  NullProperty,
  ObjectsProperty,
  PointLightProperty,
  PolyMeshPropertiesProperty,
  PostEffectProperty,
  ProxyProperty,
  SphereProperty,
  SpotlightProperty,
  TilingOverrideProperty,
  TransformProperty
]);

export type Property = z.infer<typeof Property>;
