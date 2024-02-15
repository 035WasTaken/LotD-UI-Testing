import { Vector2Data } from "../types/interface/game";

export class Vector2 {
    public data: Vector2Data;

    constructor(vec2: Vector2Data) {
        this.data = vec2;
    }

    public static AddStatic(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2({
            x: v1.data.x + v2.data.x,
            y: v1.data.y + v2.data.y,
        });
    }

    public static SubtractStatic(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2({
            x: v1.data.x - v2.data.x,
            y: v1.data.y - v2.data.y,
        });
    }

    public static MultiplyStatic(v: Vector2, scalar: number): Vector2 {
        return new Vector2({
            x: v.data.x * scalar,
            y: v.data.y * scalar,
        });
    }

    public static LengthStatic(v: Vector2): number {
        return Math.sqrt(v.data.x ** 2 + v.data.y ** 2);
    }

    public static NormalizeStatic(v: Vector2): Vector2 {
        const length = Vector2.LengthStatic(v);
        if (length !== 0) {
            return Vector2.MultiplyStatic(v, 1 / length);
        } else {
            return new Vector2({ x: 0, y: 0 });
        }
    }

    public static DotProductStatic(v1: Vector2, v2: Vector2): number {
        return v1.data.x * v2.data.x + v1.data.y * v2.data.y;
    }

    public Add(vector: Vector2): Vector2 {
        return new Vector2({
            x: this.data.x + vector.data.x,
            y: this.data.y + vector.data.y,
        });
    }

    public AddData(vector: Vector2Data): Vector2Data {
        return {
            x: this.data.x + vector.x,
            y: this.data.y + vector.y,
        };
    }

    public Subtract(vector: Vector2): Vector2 {
        return new Vector2({
            x: this.data.x - vector.data.x,
            y: this.data.y - vector.data.y,
        });
    }

    public SubtractData(vector: Vector2Data) {
        return {
            x: this.data.x - vector.x,
            y: this.data.y - vector.y,
        };
    }

    public Multiply(scalar: number): Vector2 {
        return new Vector2({
            x: this.data.x * scalar,
            y: this.data.y * scalar,
        });
    }

    public MultiplyData(scalar: number): Vector2Data {
        return {
            x: this.data.x * scalar,
            y: this.data.y * scalar,
        };
    }

    public Length(): number {
        return Math.sqrt(this.data.x ** 2 + this.data.y ** 2);
    }

    public Normalize(): Vector2 {
        const length = this.Length();
        if (length !== 0) {
            return this.Multiply(1 / length);
        } else {
            return new Vector2({ x: 0, y: 0 });
        }
    }

    public DotProduct(vector: Vector2): number {
        return this.data.x * vector.data.x + this.data.y * vector.data.y;
    }
}
