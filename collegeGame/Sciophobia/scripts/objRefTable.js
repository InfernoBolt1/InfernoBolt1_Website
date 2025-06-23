const C3 = self.C3;
self.C3_GetObjectRefTable = function () {
	return [
		C3.Plugins.TiledBg,
		C3.Plugins.Sprite,
		C3.Plugins.Mouse,
		C3.Plugins.Text,
		C3.Plugins.Keyboard,
		C3.Behaviors.EightDir,
		C3.Plugins.Mouse.Cnds.OnObjectClicked,
		C3.Plugins.System.Acts.GoToLayout,
		C3.Plugins.System.Cnds.EveryTick,
		C3.Plugins.Sprite.Acts.SetTowardPosition,
		C3.Plugins.Mouse.Exps.X,
		C3.Plugins.Mouse.Exps.Y,
		C3.Plugins.Sprite.Exps.X,
		C3.Plugins.Sprite.Exps.Y,
		C3.Plugins.Sprite.Acts.MoveForward,
		C3.Plugins.System.Cnds.OnLayoutStart,
		C3.Plugins.Sprite.Acts.SetVisible,
		C3.Plugins.Keyboard.Cnds.IsKeyDown,
		C3.Behaviors.EightDir.Acts.SimulateControl,
		C3.Plugins.Sprite.Cnds.IsOutsideLayout,
		C3.Plugins.Sprite.Cnds.OnCollision,
		C3.Plugins.Sprite.Acts.Destroy,
		C3.Plugins.System.Cnds.Every,
		C3.Plugins.System.Acts.CreateObject,
		C3.Plugins.System.Exps.layoutwidth,
		C3.Plugins.System.Exps.random,
		C3.Plugins.System.Exps.layoutheight,
		C3.Plugins.Sprite.Cnds.CompareChildCount
	];
};
self.C3_JsPropNameTable = [
	{backgroundTile: 0},
	{tileScreenName: 0},
	{howToPlayBox: 0},
	{mouse: 0},
	{playButton: 0},
	{howToPlayText: 0},
	{backgroundTileMainMenu: 0},
	{Keyboard: 0},
	{gameOver: 0},
	{mainMenuButton: 0},
	{character: 0},
	{"8Direction": 0},
	{character2: 0},
	{Health: 0},
	{shadowCreatureEnemy: 0}
];

self.InstanceType = {
	backgroundTile: class extends self.ITiledBackgroundInstance {},
	tileScreenName: class extends self.ISpriteInstance {},
	howToPlayBox: class extends self.ISpriteInstance {},
	mouse: class extends self.IInstance {},
	playButton: class extends self.ISpriteInstance {},
	howToPlayText: class extends self.ITextInstance {},
	backgroundTileMainMenu: class extends self.ITiledBackgroundInstance {},
	Keyboard: class extends self.IInstance {},
	gameOver: class extends self.ISpriteInstance {},
	mainMenuButton: class extends self.ISpriteInstance {},
	character: class extends self.ISpriteInstance {},
	character2: class extends self.ISpriteInstance {},
	shadowCreatureEnemy: class extends self.ISpriteInstance {}
}