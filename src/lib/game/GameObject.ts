/**
 * A class for managing game data.
 */
export class GameObject {
    private name: string;
    private static objects: Map<string, GameObject> = new Map();

    // maybe? this is staying for now, but might be removed if i decide to
    // not implement multi-tile objects
    private width: number = 0;
    private height: number = 0;

    constructor(name: string) {
        this.name = name;
    }

    public static GetObjectByName(name: string) {
        return this.objects.get(name);
    }

    public GetName() {
        return this.name;
    }

    public /* virtual */ Update(): void {}
}
