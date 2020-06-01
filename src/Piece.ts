import { Cell, Position } from './Board';
import { PlayerType } from './Player';

// 이미지
import loinImage from './images/lion.png';
import chickenImage from './images/chicken.png';
import griffImage from './images/griff.png';
import elophantImage from './images/elophant.png';

export class MoveResult {
    constructor(private killedPiece: Piece) {}
    getKilled() {
        return this.killedPiece;
    }
}

export interface Piece {
    ownerType: PlayerType; // 위쪽 플레이어인지 아래쪽 플레이어인지에 따라 다르게 그려줘야함
    currentPosition: Position; // 피스의 현재 위치
    move(from: Cell, to: Cell): MoveResult; // 셀에서 셀로 이동하는 메서드
    render(): string;
}

abstract class DefaultPiece implements Piece {
    constructor(public readonly ownerType: PlayerType, public currentPosition: Position) {}
    move(from: Cell, to: Cell): MoveResult {
        if (!this.canMove(to.position)) {
            throw new Error('can no move');
        }

        const moveResult = new MoveResult(to.getPiece() != null ? to.getPiece() : null);
        // 움직이는 대상 셀 위에 피스가 놓여져 있으면 죽인거고 빈칸이면 죽인게 없음
        to.put(this);
        from.put(null);
        this.currentPosition = to.position;
        return moveResult;
    }

    abstract canMove(Position: Position): boolean;
    abstract render();
}

export class Lion extends DefaultPiece {
    canMove(pos: Position) {
        const canMove =
            (pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col) ||
            (pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col) ||
            (pos.col === this.currentPosition.col + 1 && pos.row === this.currentPosition.row) ||
            (pos.col === this.currentPosition.col - 1 && pos.row === this.currentPosition.row) ||
            (pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col + 1) ||
            (pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col - 1) ||
            (pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col + 1) ||
            (pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col - 1);
        return canMove;
    }

    render(): string {
        return `<img class="piece ${this.ownerType}" src="${loinImage}" width="90%" height="90%"/>`;
    }
}

// 코끼리: 대각선
export class Elephant extends DefaultPiece {
    canMove(pos: Position) {
        return (
            (pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col + 1) ||
            (pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col - 1) ||
            (pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col + 1) ||
            (pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col - 1)
        );
    }

    render(): string {
        return `<img class="piece ${this.ownerType}" src="${elophantImage}" width="90%" height="90%"/>`;
    }
}

//기린: 상 하 좌 우
export class Griff extends DefaultPiece {
    canMove(pos: Position) {
        return (
            (pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col) ||
            (pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col) ||
            (pos.col === this.currentPosition.col + 1 && pos.row === this.currentPosition.row) ||
            (pos.col === this.currentPosition.col - 1 && pos.row === this.currentPosition.row)
        );
    }

    render(): string {
        return `<img class="piece ${this.ownerType}" src="${griffImage}" width="90%" height="90%"/>`;
    }
}

// 닭: 앞으로만
export class Chick extends DefaultPiece {
    canMove(pos: Position) {
        return this.currentPosition.row + (this.ownerType == PlayerType.UPPER ? +1 : -1) === pos.row;
    }

    render(): string {
        return `<img class="piece ${this.ownerType}" src="${chickenImage}" width="90%" height="90%"/>`;
    }
}
