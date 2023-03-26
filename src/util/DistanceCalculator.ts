import {EntityDistance, EntityDistanceResult, LocationData, TimestampDistance} from '../common/types/Simple';

const euclideanDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export const findEntityDistances = (
    entityId: string,
    data: Map<string, LocationData[]>
): EntityDistanceResult => {
    const sourceData = data.get(entityId);

    if (!sourceData) {
        throw new Error(`Entity ${entityId} not found in the dataset`);
    }

    const entityDistances: EntityDistance[] = [];

    data.forEach((targetData, targetId) => {
        if (targetId === entityId || !targetId.startsWith("Participant")) {
            return;
        }

        const distances: TimestampDistance[] = sourceData.map((sourcePoint) => {
            const targetPoint = targetData.find((point) => point.time === sourcePoint.time);

            if (!targetPoint) {
                return {
                    time: sourcePoint.time,
                    distance: null,
                };
            }

            const distance = euclideanDistance(
                parseFloat(sourcePoint.x),
                parseFloat(sourcePoint.y),
                parseFloat(targetPoint.x),
                parseFloat(targetPoint.y)
            );

            return {
                time: sourcePoint.time,
                distance,
            };
        });

        entityDistances.push({
            entityId: targetId,
            distances,
        });
    });

    return {
        sourceEntity: entityId,
        entityDistances,
    };
}
