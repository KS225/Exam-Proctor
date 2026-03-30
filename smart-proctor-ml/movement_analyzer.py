class MovementAnalyzer:

    def __init__(self):

        self.history = []
        self.window = 10

    def update(self, direction):

        self.history.append(direction)

        if len(self.history) > self.window:
            self.history.pop(0)

    def frequent_movement(self):

        moves = [d for d in self.history if d != "center"]

        return len(moves) >= 6