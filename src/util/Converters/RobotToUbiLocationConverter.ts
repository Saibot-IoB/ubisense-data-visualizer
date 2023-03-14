import { applyToPoint, compose, flipY, translate } from "transformation-matrix";

export class RobotToUbiLocationConverter {
    private static matrix = compose(
        translate(22, 1),
        flipY()
    )

    public static transformPoint(dataPoint: { x: number, y: number }): { tx: number, ty: number } {
        const { x, y } = applyToPoint(this.matrix, dataPoint);
        return { tx: x, ty: y };
    }
}



