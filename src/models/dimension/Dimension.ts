import {
  ColumnNameDimension,
  DimensionDataI,
} from "../../services/DimensionService/type";
import { StepName } from "../../utils/baseUtils";
import { AudioExtensionName, CameraName } from "../../utils/permissionUtils";
import { Condition } from "../conditions/Condition";
import { ConditionPropertyName } from "../conditions/type";
import { PlacementManager } from "../configurator/PlacementManager";
import { ItemElement } from "../permission/elements/ItemElement";
import { CountableMountElement } from "../permission/elements/mounts/CountableMountElement";
import { MountElement } from "../permission/elements/mounts/MountElement";
import { Permission } from "../permission/Permission";
import { getRoadMapDimensionByRoom } from "./roadMapDimension";
import {
  DataDistanceI,
  DimensionNodeData,
  DimensionNodeI,
  RoadMapItemDimensionDataI,
} from "./type";

export class Dimension {
  private permissionElement: Permission;
  private dataCondition: DimensionDataI[];
  private dimensionNodeData: DimensionNodeData[] = [];

  constructor(permissionElement: Permission, dataCondition: DimensionDataI[]) {
    this.permissionElement = permissionElement;
    this.dataCondition = dataCondition;
    this.buildDimension();
  }

  public static metersToFeet(meters: number): number {
    const conversionFactor = 3.280839895;
    return Math.floor(meters * conversionFactor * 10) / 10;
  }

  public buildDimension(): void {
    const activeRoomData = this.getActiveRoomDimensionData();
    this.dimensionNodeData = [...activeRoomData, ...this.buildDimensionNodes()];
  }

  private getActiveRoomDimensionData(): DimensionNodeData[] {
    const roomStep = this.permissionElement.getStepByName(StepName.RoomSize);
    const [activeRoom] = roomStep.getActiveElements();
    return this.getDimensionDataForRoomSize(activeRoom.name);
  }

  private buildDimensionNodes(): DimensionNodeData[] {
    const elements = this.permissionElement.getAllElements();
    const activeElements = this.permissionElement.getAllActiveElements();
    const activeElementsNames = activeElements.map((el) => el.name);

    const validDataConditions = this.getValidDataConditions(
      elements,
      activeElementsNames
    );

    if (!validDataConditions.length) return [];
    const dataCondition = validDataConditions[0];

    const roadMapNodes = this.getRoadMapNodesRoom(
      elements,
      activeElementsNames
    );

    const micPodNodes = this.getMicPodDimensionNodes(
      dataCondition,
      activeElements,
      roadMapNodes
    );
    return [...micPodNodes];
  }

  private getValidDataConditions(
    elements: (ItemElement | MountElement)[],
    activeNames: string[]
  ): DimensionDataI[] {
    return this.dataCondition.filter((data) =>
      data.conditions.every((condition) =>
        this.checkCondition(condition, elements, activeNames)
      )
    );
  }

  private checkCondition(
    condition: Condition,
    elements: (ItemElement | MountElement)[],
    activeNames: string[]
  ): boolean {
    const element = elements.find(
      (el) => el.name === condition.getKeyPermission()
    );
    if (!element) return false;

    let property = {
      ...element.getProperty(),
      [ConditionPropertyName.ACTIVE]: activeNames.includes(element.name),
    };

    if (element instanceof ItemElement) {
      const defaultMount = element.getDefaultMount();
      if (defaultMount instanceof MountElement) {
        property = { ...property, ...defaultMount.getProperty() };
      }
    }

    return condition.checkCondition(property);
  }

  private getMicPodDimensionNodes(
    dataCondition: DimensionDataI,
    activeElements: (ItemElement | MountElement)[],
    roadMapNodes: RoadMapItemDimensionDataI | undefined
  ): DimensionNodeData[] {
    const nodes: string[][] = [];

    const micPodElement = activeElements.find(
      (el) => el.name === AudioExtensionName.RallyMicPod
    );
    const defaultMountMicPod =
      micPodElement instanceof ItemElement
        ? micPodElement.getDefaultMount()
        : null;

    const sightElement = activeElements.find(
      (el) => el.name === CameraName.LogitechSight
    );

    if (roadMapNodes) {
      if (defaultMountMicPod instanceof CountableMountElement) {
        const activeIndex = defaultMountMicPod.activeIndex;
        const newNodeRoadMap = roadMapNodes.orderMicPods.map((order) => {
          return order
            .filter((i) => i <= activeIndex)
            .map((index) => `${roadMapNodes.nodeMicPod}_${index}`);
        });
        nodes.push(...newNodeRoadMap);
      }

      if (
        sightElement &&
        roadMapNodes.nodeSight &&
        roadMapNodes.indexSight !== undefined &&
        nodes[0]
      ) {
        nodes[0].splice(roadMapNodes.indexSight, 0, roadMapNodes.nodeSight);
      }
    }

    return [
      ...this.getCameraToMicPodNodes(dataCondition, nodes),
      ...this.getMicPodToMicPodNodes(dataCondition, nodes),
    ];
  }

  private getCameraToMicPodNodes(
    dataCondition: DimensionDataI,
    nodeNames: string[][]
  ): DimensionNodeData[] {
    if (!dataCondition.data[ColumnNameDimension.CAMERA_TO_MIC_POD_METER])
      return [];

    const distance = this.getDataDistance(
      ColumnNameDimension.CAMERA_TO_MIC_POD_METER,
      dataCondition.data
    );

    return nodeNames.map((nodes) => {
      const lastNode = nodes[nodes.length - 1];
      return this.getDimensionNodeDataByData(distance, {
        nodeAName: PlacementManager.getNameNodeCommodeForCamera("RallyBar", 2),
        nodeBName: lastNode,
      });
    });
  }

  private getMicPodToMicPodNodes(
    dataCondition: DimensionDataI,
    nodeNames: string[][]
  ): DimensionNodeData[] {
    if (!dataCondition.data[ColumnNameDimension.MIC_POD_TO_MIC_POD_METER])
      return [];

    const distance = this.getDataDistance(
      ColumnNameDimension.MIC_POD_TO_MIC_POD_METER,
      dataCondition.data
    );
    return nodeNames
      .map((nodes) =>
        nodes.slice(0, -1).map((current, index) =>
          this.getDimensionNodeDataByData(distance, {
            nodeAName: current,
            nodeBName: nodes[index + 1],
          })
        )
      )
      .flat();
  }

  public getDataDimension(): DimensionNodeData[] {
    return [...this.dimensionNodeData];
  }

  public getDimensionDataForRoomSize(
    keyPermission: string
  ): DimensionNodeData[] {
    const dataCondition = this.dataCondition.find(
      (data) => data.data[ColumnNameDimension.ROOM_SIZE] === keyPermission
    );
    if (!dataCondition) return [];
    return [
      this.getDimensionNodeDataByData(
        this.getDataDistance(
          ColumnNameDimension.ROOM_WIDTH_METER,
          dataCondition.data
        ),
        {
          nodeAName: PlacementManager.getNameNodeRoomWidth(1),
          nodeBName: PlacementManager.getNameNodeRoomWidth(2),
        }
      ),
      this.getDimensionNodeDataByData(
        this.getDataDistance(
          ColumnNameDimension.ROOM_LENGTH_METER,
          dataCondition.data
        ),
        {
          nodeAName: PlacementManager.getNameNodeRoomLength(1),
          nodeBName: PlacementManager.getNameNodeRoomLength(2),
        }
      ),
    ];
  }

  private getDimensionNodeDataByData(
    dataDistance: DataDistanceI,
    dataNode: DimensionNodeI
  ): DimensionNodeData {
    return {
      label: `${dataDistance.feet} ft / ${dataDistance.meter} m`,
      nodeAName: dataNode.nodeAName,
      nodeBName: dataNode.nodeBName,
    };
  }

  private getDataDistance(
    colName: ColumnNameDimension,
    data: Record<ColumnNameDimension, string>
  ): DataDistanceI {
    const value = parseFloat(data[colName]);
    const valueFeet = Dimension.metersToFeet(value);
    return {
      meter: value,
      feet: valueFeet,
    };
  }

  private getActiveRoomName(): string {
    const roomStep = this.permissionElement.getStepByName(StepName.RoomSize);
    const [activeRoom] = roomStep.getActiveElements();
    return activeRoom.name;
  }

  private getRoadMapNodesRoom(
    elements: (ItemElement | MountElement)[],
    activeNames: string[]
  ): RoadMapItemDimensionDataI | undefined {
    const activeRoom = this.getActiveRoomName();
    const roadMapNodes = getRoadMapDimensionByRoom();
    const data = roadMapNodes[activeRoom];
    const validItem = data.find((item) =>
      item.conditions.every((condition) =>
        this.checkCondition(condition, elements, activeNames)
      )
    );
    return validItem?.data;
  }
}
