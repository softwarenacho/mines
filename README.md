# Minesweeper Game

A classic Minesweeper game implemented in React with Next.js, TypeScript, and Sass modules.

## Overview

This project is a clone of the classic Minesweeper game, built using modern web technologies including React, Next.js, TypeScript, and Sass modules. It aims to provide an interactive and enjoyable Minesweeper gaming experience directly in the browser.

## Features

- Dynamic game board generation based on specified size and number of mines.
- Click to reveal cells, revealing numbers indicating adjacent mines or a mine itself.
- Right-click to place flags on potential mines.
- Timer to track the duration of the game.
- Game over detection when clicking on a mine, with all mines revealed.
- Win condition detection when all non-mine cells are successfully cleared.
- Installation

## Development

Clone the repository:

```bash
git clone https://github.com/softwarenacho/mines.git
```

Navigate into the project directory:

```bash
cd mines
```

Install dependencies:

```bash
yarn
```

## Usage

To start the Minesweeper game locally run the development server:

```bash
yarn dev
```

Open your browser and navigate to:

http://localhost:3000

## Play the game:

- Left-click on cells to reveal them.
- Right-click (or long press on touch devices) to place flags.
- Try to uncover all non-mine cells without triggering any mines to win the game!
- Acknowledgments
- Built with React, Next.js, TypeScript, and Sass modules.
- Icons images sourced from FlatIcon.
- Background image sourced from Unsplash.
- Minesweeper logic adapted from classic game mechanics.

## To Do

- Customize bombs and size
