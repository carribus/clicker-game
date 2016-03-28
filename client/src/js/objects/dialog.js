/**
 * Created by petermares on 26/03/2016.
 */

module.exports = Dialog;

function Dialog(game, x, y, width, height, backgroundColour, borderColour) {
    this.backgroundColour = backgroundColour;
    this.borderColour = borderColour;
    this.bmp = game.add.bitmapData(width, height);
    this.titleHeight = 80;
    this.panels = {};

    Phaser.Sprite.call(this, game, x, y, this.bmp);

    this.inputEnabled = true;
    this.anchor.set(0.5);

    this.closeButton = game.add.button(width/2, -height/2, 'button_close', this.closeButtonHandler, this);
    this.closeButton.alpha = 1;
    this.closeButton.anchor.set(0.5);
    this.closeButton.scale.set(1.2);
    this.closeButton.input.priorityID = 1;
    this.addChild(this.closeButton);
    this.onCloseButtonPressed = new Phaser.Signal();

    this.txtTitle = game.add.text(0, -height/2+this.titleHeight/3, 'Untitled Dialog', {
        font: '28pt Arial',
        boundsAlignH: 'left',
        boundsAlignV: 'middle',
        fill: 'white'
    });
    this.txtTitle.anchor.set(0.5);
    this.txtTitle.setTextBounds(0, 0, width, this.titleHeight);
    this.addChild(this.txtTitle);

    this.refresh();
}

Dialog.prototype = Object.create(Phaser.Sprite.prototype);
Dialog.prototype.constructor = Dialog;

Dialog.prototype.refresh = function() {
    var ctx = this.bmp.ctx;

    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(this.width, 0);
    ctx.lineTo(this.width, this.height-10);
    ctx.lineTo(this.width-10, this.height);
    ctx.lineTo(0, this.height);
    ctx.lineTo(0, 10);
    ctx.closePath();

    ctx.moveTo(0, this.titleHeight);
    ctx.lineTo(this.width, this.titleHeight);

    ctx.lineWidth = 4;
    ctx.strokeStyle = this.borderColour;
    ctx.fillStyle = this.backgroundColour;
    ctx.fill();
    ctx.stroke();

    this.bmp.dirty = true;
};

Dialog.prototype.setTitle = function(title) {
    this.txtTitle.text = title;
    //this.refresh();
};

Dialog.prototype.closeButtonHandler = function(target) {
    console.log('Dialog: Close Button Pressed');
    for ( k in this.panels ) {
        this.panels[k].visible = false;
    }
    this.onCloseButtonPressed.dispatch();
};

Dialog.prototype.addPanel = function(id, isVisible) {
    if ( this.panels[id] ) {
        this.removeChild(this.panels[id]);
        this.panels[id].kill();
    }

    this.panels[id] = this.game.add.image(0, 0);
    this.panels[id].visible = isVisible;
    this.panels[id].anchor.set(0.5);
    this.addChild(this.panels[id]);

    return this.panels[id];
};

Dialog.prototype.showPanel = function(id, showFlag) {
    if ( this.panels[id] ) {
        this.panels[id].visible = showFlag;
    }
};