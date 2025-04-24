export enum Status {
  WHITE = 1,
  BLACK = 2,
  EMPTY = 3,
  OUT = 4,
}

export class Goban {
  private board: string[];

  constructor(board: string[]) {
    this.board = board;
  }

  public print() {
    console.log(this.board.join("\n"));
  }

  public getStatus(x: number, y: number): Status {
    if (
      !this.board ||
      x < 0 ||
      y < 0 ||
      y >= this.board.length ||
      x >= this.board[0].length
    ) {
      return Status.OUT;
    } else if (this.board[y][x] === ".") {
      return Status.EMPTY;
    } else if (this.board[y][x] === "o") {
      return Status.WHITE;
    } else if (this.board[y][x] === "#") {
      return Status.BLACK;
    }
    throw new Error(`Unknown goban value ${this.board[y][x]}`);
  }

  public isTaken(x: number, y: number): boolean {
    const status = this.getStatus(x, y);
    if (status === Status.EMPTY || status === Status.OUT) {
      return false;
    }

    const shape = this.findShape(x, y, status);
    return !this.hasFreedom(shape);
  }

  private findShape(
    x: number,
    y: number,
    color: Status,
    visited: Set<string> = new Set(),
  ): Set<string> {
    if (
      this.getStatus(x, y) !== color ||
      visited.has(`${x},${y}`)
    ) {
      return new Set();
    }

    visited.add(`${x},${y}`);

    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    neighbors.forEach(([nx, ny]) => {
      this.findShape(nx, ny, color, visited);
    });

    return visited;
  }

  private hasFreedom(shape: Set<string>): boolean {
    for (const stone of shape) {
      const [x, y] = stone.split(",").map(Number);
      const neighbors = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ];
      if (neighbors.some(([nx, ny]) => this.getStatus(nx, ny) === Status.EMPTY)) return true;
    }
    return false;
  }
}
