# Snake

Snake in JS

## Running the game

Either open `index.html` in a web browser, or [click here](http://www.jordanroth.xyz/snake) to play the live version.

## Controls

Arrow Keys for red. WASD for Blue
'p' to pause and start game
'space' to restart game

## Snake Features

- Only updates the changed squares when rendering.
- Level starts at level 5. Increase it between games at your own risk.
- Keeps score based on level.

## Snake-Tron Features

- Can play vs another player. If you run into each other you still die!
- Competing for apples as well as total victory.
- Easily customizable code.

# Customization

To do anything, you will first need to download or clone it.

## Adding More Players

- First go to the snake.js page and add the next entry into SnakeInfo. This
  must include the starting direction, the starting squares, and a color. Make
  sure you aren't starting off running into yourself!
- Next, go to the css page and create an entry at the bottom for your snake.
  It will need to look something like this, with your color and number input:
```
  ul.grid > li.snake-segment3 {
    background: green;
    opacity: 1;
    transition: opacity .1s;
  }
```
- If you are going to have more than 3 players, you will need to determine your own set of keybindings for the 4th and beyond.
- Finally, in the splash-page-view.js file, on line 23 change the number of players
  for the VSGame initialization.
- Click VSGame when the splash page comes up!

## Changing colors

Both the snake and the css file hold the color, so you will need to go to both;
- In the snake.js file, find the snake with your current color and change it to
  what you want.
- In the snake.css file, do a cmd-f('snake-segment') and go until you find the
  appropriate number. Change it there.

## Speed

There are already adjustable levels included, but if you want more or less of a
challenge, you can either adjust the number manually in the splash-page-view
file or you can change the challenge factors on line 6 of the snake-view.js file.
Be aware that this is how the score is also calculated, so that might be a bit off.
