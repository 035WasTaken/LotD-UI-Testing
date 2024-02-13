import { Unit } from '../types/interface/game';

export class GameArea {
    grid: Unit[] = [];

    public detectUnits(range: number): Unit[] {
        return this.grid;
    }
}
