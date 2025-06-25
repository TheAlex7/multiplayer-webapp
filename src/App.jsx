import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';

function App() {
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
    const [starPosition, setStarPosition] = useState({ x: 0, y: 0 });

    const changeScene = () => {

        const scene = phaserRef.current.scene;

        if (scene) {
            scene.changeScene();
        }
    }

    const moveSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene && scene.scene.key === 'MainMenu') {
            // Get the update logo position
            scene.moveLogo(({ x, y }) => {

                setSpritePosition({ x, y });

            });

            scene.moveStar(({ x, y }) => {

                setStarPosition({ x, y });

            });
        }
    }

    const addSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene) {
            // Add more stars
            let centerX = Phaser.Math.Between(64, scene.scale.width - 64);
            let centerY = Phaser.Math.Between(64, scene.scale.height - 64);
            const center = new Phaser.Math.Vector2(centerX, centerY);

            let radius = 20 + Math.random() * 80;
            //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
            const container = scene.add.container(centerX, centerY);
            const star = scene.add.sprite(-20, -20, 'star');
            // const man = scene.add.sprite(centerX, centerY, 'man')
            // container.add(star);

            //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
            //  You could, of course, do this from within the Phaser Scene code, but this is just an example
            //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
            scene.tweens.addCounter({
                duration: 1000 + Math.random() * 1000,
                from: 0,
                to: 360 * (Math.random() > .5 ? 1 : -1),
                repeat: -1,
                onUpdate: tween => {
                    const angle = Phaser.Math.DegToRad(tween.getValue());
                    star.x = center.x + radius * Math.cos(angle);
                    star.y = center.y + radius * Math.sin(angle);
                }
            });
            scene.tweens.add({
                targets: center,
                x: centerX+200,
                duration: 2000,
                yoyo: true,
                repeat: -1
            });
        }
    }

    const addSprite2 = () => {

        const scene = phaserRef.current.scene;

        if (scene) {
            const star = scene.add.sprite(0, 0, 'star');
            star.setScale(20);

        }
    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {

        setCanMoveSprite(scene.scene.key !== 'MainMenu');

    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
                <div>
                    <button className="button" onClick={changeScene}>Change Scene</button>
                </div>
                <div>
                    <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
                </div>
                <div className="spritePosition">Sprite Position:
                    <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
                </div>
                <div>
                    <button className="button" onClick={addSprite}>Add New Sprite</button>
                </div>
                <div>
                    <button className="button" onClick={addSprite2}>2nd Add New Sprite</button>
                </div>
            </div>
        </div>
    )
}

export default App
