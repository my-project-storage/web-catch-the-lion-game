import { Board, DeadZone, Cell } from './Board';
import { Player, PlayerType } from './Player';
import { Lion } from './Piece';

export class Game {
    private selectedCell: Cell; // 현재 선택된 셀
    private turn = 0; // 현재 턴(게임 횟수)
    private currentPlayer: Player; // 현재 플레이어
    private gameInfoEl = document.querySelector('.alert'); // 게임에 대한 정보
    private state: 'STARTED' | 'END' = 'STARTED'; // 게임 상태(기본 start)

    readonly upperPlayer = new Player(PlayerType.UPPER); // 플레이어 초기화
    readonly lowerPlayer = new Player(PlayerType.LOWER); // 플레이어 초기화
    readonly board = new Board(this.upperPlayer, this.lowerPlayer); // 보드 생성
    readonly upperDeadZone = new DeadZone('upper'); // 위쪽 유저 데드존 생성
    readonly lowerDeadZone = new DeadZone('lower'); // 아래쪽 유저 데드존 생성

    constructor() {
        const boardContainer = document.querySelector('.board-container'); // 보드 컨테이너 찾기
        // boardContainer.firstChild.remove();
        boardContainer.appendChild(this.board._el);

        this.currentPlayer = this.upperPlayer; // 시작은 위쪽 플레이어부터

        this.board.render();
        this.renderInfo();

        // 보드 엘리먼트에서 모든 클릭 이벤트를 듣는다
        this.board._el.addEventListener('click', (e) => {
            if (this.state === 'END') {
                return false;
            }
            if (e.target instanceof HTMLElement) {
                let cellEl: HTMLElement;
                if (e.target.classList.contains('cell')) {
                    cellEl = e.target;
                } else if (e.target.classList.contains('piece')) {
                    cellEl = e.target.parentElement;
                } else {
                    return false;
                }
                const cell = this.board.map.get(cellEl);
                if (this.isCurrentUserPiece(cell)) {
                    this.select(cell);
                    return false;
                }

                if (this.selectedCell) {
                    this.move(cell);
                    this.changeTurn();
                }
            }
        });
    }

    // 셀 선택
    select(cell: Cell) {
        if (cell.getPiece() == null) return; // 선택한 셀에 피스가 없을 때
        if (cell.getPiece().ownerType !== this.currentPlayer.type) return; // 자신의 피스가 아닐 때
        if (this.selectedCell) {
            this.selectedCell.deactive();
            this.selectedCell.render();
        }
        this.selectedCell = cell;
        cell.active();
        cell.render();
    }

    // 피스를 움직임, 죽인 피스가 있다면 데드존으로 이동, 만약 죽인 피스가 사자라면 게임 종료
    move(cell: Cell) {
        this.selectedCell.deactive();
        const killed = this.selectedCell.getPiece().move(this.selectedCell, cell).getKilled();
        this.selectedCell = cell;

        if (killed) {
            if (killed.ownerType === PlayerType.UPPER) {
                this.lowerDeadZone.put(killed);
            } else {
                this.upperDeadZone.put(killed);
            }
            if (killed instanceof Lion) {
                this.state = 'END';
            }
        }
    }

    // 현재 플레이어의 피스냐 판단함
    isCurrentUserPiece(cell: Cell) {
        return cell != null && cell.getPiece() != null && cell.getPiece().ownerType === this.currentPlayer.type;
    }

    renderInfo(extraMessage?: string) {
        this.gameInfoEl.innerHTML = `${this.turn}턴 ${this.currentPlayer.type} 차례 ${extraMessage ? '| ' + extraMessage : ''}`;
    }
    changeTurn() {
        this.selectedCell.deactive();
        this.selectedCell = null;
        if (this.state === 'END') {
            this.renderInfo('END!');
        } else {
            this.turn += 1;
            this.currentPlayer = this.currentPlayer === this.lowerPlayer ? this.upperPlayer : this.lowerPlayer;
            this.renderInfo();
        }
        this.board.render();
    }
}
