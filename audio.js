//audio
export var backgroundTheme = new Audio()
backgroundTheme.src = "./Assets/music/theme.wav"
backgroundTheme.loop = true;
export var backgroundThemeRegular = 0.2;
backgroundTheme.volume = backgroundThemeRegular;

export var duckTheme = new Audio()
duckTheme.src = "./Assets/music/duck.m4a"
duckTheme.loop = false;
export var duckThemeThemeRegular = 0.3;
duckTheme.volume = duckThemeThemeRegular;

export var winTheme = new Audio()
winTheme.src = "./Assets/music/win.wav"
winTheme.loop = false;
export var winThemeThemeRegular = 0.5;
winTheme.volume = winThemeThemeRegular;