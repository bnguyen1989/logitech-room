type feature = any;

export class Annotation {
  dataProduct: any = {};

  constructor(dataProduct: any) {
    this.dataProduct = dataProduct;
  }

  getImageResource(resourcesLink: string[]): string[] {
    const keyVideoFormat = ".mp4";

    const resources = resourcesLink.filter(
      (link) => !link.includes(keyVideoFormat)
    );

    return resources;
  }
  getVideoResource(resourcesLink: string[]): string[] {
    const keyVideoFormat = ".mp4";

    const resources = resourcesLink.filter((link) =>
      link.includes(keyVideoFormat)
    );

    return resources;
  }

  getFeatureVideos(feature: feature): string[] {
    const keyLinkIMG = "LinkImgFeature";

    if (!Object.prototype.hasOwnProperty.call(feature, keyLinkIMG)) return [];

    const resources: string[] = Object.values(feature["LinkImgFeature"]);

    if (resources.length < 1) return [];

    const resourcesImg = this.getVideoResource(resources);

    return resourcesImg;
  }
  getFeatureImages(feature: feature): string[] {
    const keyLinkIMG = "LinkImgFeature";

    if (!Object.prototype.hasOwnProperty.call(feature, keyLinkIMG)) return [];

    const resources: string[] = Object.values(feature["LinkImgFeature"]);

    if (resources.length < 1) return [];

    const resourcesImg = this.getImageResource(resources);

    return resourcesImg;
  }

  getFeatures(keyFeature: string): feature[] | [] {
    if (!Object.prototype.hasOwnProperty.call(this.dataProduct, keyFeature))
      return [];

    const feature = this.dataProduct[keyFeature];
    let featureList = Object.values(feature).sort(
      (feature1: feature, feature2: feature) =>
        feature1.sorting - feature2.sorting
    );
    featureList = featureList.map((feature: any) => {
      return {
        ...feature,
        images: this.getFeatureImages(feature),
        videos: this.getFeatureVideos(feature),
      };
    });

    return featureList;
  }

  hasShow(featureList: feature[]) {
    return featureList.length > 0;
  }
  hasGap2(featureList: feature[]) {
    return featureList.length === 2;
  }
  hasGap3(featureList: feature[]) {
    return featureList.length === 3;
  }
}
