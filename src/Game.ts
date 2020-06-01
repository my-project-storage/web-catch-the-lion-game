import { Board, DeadZone } from './Board';

export class Game {
    readonly board = new Board(); // 보드 생성
    readonly upperDeadZone = new DeadZone('upper'); // 위쪽 유저 데드존 생성
    readonly lowerDeadZone = new DeadZone('lower'); // 아래쪽 유저 데드존 생성
    constructor() {
        const boardContainer = document.querySelector('.board-container'); // 보드 컨테이너 찾기
        // boardContainer.firstChild.remove();
        boardContainer.appendChild(this.board._el);
    }
}
