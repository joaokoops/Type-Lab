import { useEffect, useMemo, useRef, useState } from 'react'
import type { GridItem } from './gridModel'
import { parseGridLayerList, parseFigmaJson } from './gridModel'
import { GridViewOverlay } from './GridViewOverlay'

const defaultPaste = `GAME_A-45FFAE-367B5D\nWAVE-FFFFFF-000000`

// The provided Figma JSON data
const figmaJsonData = `[{"name":"GAME_A-45FFAE-367B5D","type":"FRAME","x":20,"y":20,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.21221013367176056,"g":0.4823529124259949,"b":0.3652909994125366},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_A","type":"TEXT","x":119.5,"y":103.5,"width":121,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.2712871730327606,"g":1,"b":0.6842243075370789},"boundVariables":{}}],"characters":"Game_A","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-121","height":"h-38","margin-left":"ml-120","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-20","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_B-441287-B323DC","type":"FRAME","x":400,"y":20,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.7019608020782471,"g":0.13725490868091583,"b":0.8627451062202454},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_B","type":"TEXT","x":119,"y":103.5,"width":122,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.2666666805744171,"g":0.07058823853731155,"b":0.529411792755127},"boundVariables":{}}],"characters":"Game_B","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-122","height":"h-38","margin-left":"ml-119","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-400","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_C-FFC4C1-F9362A","type":"FRAME","x":780,"y":20,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.9764705896377563,"g":0.21176470816135406,"b":0.16470588743686676},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_C","type":"TEXT","x":119.5,"y":103.5,"width":121,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":1,"g":0.7705280780792236,"b":0.7564069032669067},"boundVariables":{}}],"characters":"Game_C","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-121","height":"h-38","margin-left":"ml-120","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-780","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_D-FD68A6-310247","type":"FRAME","x":1160,"y":20,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.1921568661928177,"g":0.007843137718737125,"b":0.27843138575553894},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_D","type":"TEXT","x":119,"y":103.5,"width":122,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.9933894276618958,"g":0.4075474739074707,"b":0.6513206362724304},"boundVariables":{}}],"characters":"Game_D","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-122","height":"h-38","margin-left":"ml-119","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-1160","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_E-FDFCF7-F6D324","type":"FRAME","x":1540,"y":20,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.9647058844566345,"g":0.8274509906768799,"b":0.1411764770746231},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_E","type":"TEXT","x":121.5,"y":103.5,"width":117,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.9927008748054504,"g":0.9869012832641602,"b":0.9675328731536865},"boundVariables":{}}],"characters":"Game_E","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-117","height":"h-38","margin-left":"ml-122","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-1540","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_F-E6D8E5-156886","type":"FRAME","x":20,"y":285,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.08235294371843338,"g":0.40784314274787903,"b":0.5254902243614197},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_F","type":"TEXT","x":121.5,"y":103.5,"width":117,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.9019607901573181,"g":0.8470588326454163,"b":0.8980392217636108},"boundVariables":{}}],"characters":"Game_F","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-117","height":"h-38","margin-left":"ml-122","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-20","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_G-BDD3CC-445A48","type":"FRAME","x":400,"y":285,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.2666666805744171,"g":0.3529411852359772,"b":0.2823529541492462},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_G","type":"TEXT","x":119.5,"y":103.5,"width":121,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.7411764860153198,"g":0.8274509906768799,"b":0.800000011920929},"boundVariables":{}}],"characters":"Game_G","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-121","height":"h-38","margin-left":"ml-120","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-400","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_I-367B5D-367B5D","type":"FRAME","x":780,"y":285,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.9803921580314636,"g":0.7960784435272217,"b":0},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_I","type":"TEXT","x":124,"y":103.5,"width":112,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.4941176474094391,"g":0.21176470816135406,"b":0.1764705926179886},"boundVariables":{}}],"characters":"Game_I","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-112","height":"h-38","margin-left":"ml-124","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-780","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_H-58137E-2CDF79","type":"FRAME","x":1160,"y":285,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.1725490242242813,"g":0.8745098114013672,"b":0.4745098054409027},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_H","type":"TEXT","x":119,"y":103.5,"width":122,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.3450980484485626,"g":0.07450980693101883,"b":0.4941176474094391},"boundVariables":{}}],"characters":"Game_H","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-122","height":"h-38","margin-left":"ml-119","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-1160","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_J-FF3316-21B5F8","type":"FRAME","x":1540,"y":285,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.12941177189350128,"g":0.7098039388656616,"b":0.9725490212440491},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_J","type":"TEXT","x":120,"y":103.5,"width":120,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":1,"g":0.20000000298023224,"b":0.08627451211214066},"boundVariables":{}}],"characters":"Game_J","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-120","height":"h-38","margin-left":"ml-120","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-1540","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_K-6D82FF-122684","type":"FRAME","x":20,"y":550,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.07058823853731155,"g":0.14901961386203766,"b":0.5176470875740051},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_K","type":"TEXT","x":119.5,"y":103.5,"width":121,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.4255963861942291,"g":0.5114268064498901,"b":1},"boundVariables":{}}],"characters":"Game_K","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-121","height":"h-38","margin-left":"ml-120","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-20","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_L-D1CA9C-51501F","type":"FRAME","x":400,"y":550,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.3176470696926117,"g":0.3137255012989044,"b":0.12156862765550613},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_L","type":"TEXT","x":121.5,"y":103.5,"width":117,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.8196078538894653,"g":0.7921568751335144,"b":0.6117647290229797},"boundVariables":{}}],"characters":"Game_L","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-117","height":"h-38","margin-left":"ml-122","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-400","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_M-D2D7DC-2243E2","type":"FRAME","x":780,"y":550,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.13333334028720856,"g":0.26274511218070984,"b":0.886274516582489},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_M","type":"TEXT","x":116,"y":103.5,"width":128,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.8235294222831726,"g":0.843137264251709,"b":0.8627451062202454},"boundVariables":{}}],"characters":"Game_M","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-128","height":"h-38","margin-left":"ml-116","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-780","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_N-00A399-622199","type":"FRAME","x":1160,"y":550,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.3843137323856354,"g":0.12941177189350128,"b":0.6000000238418579},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_N","type":"TEXT","x":119,"y":103.5,"width":122,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0,"g":0.6392157077789307,"b":0.6000000238418579},"boundVariables":{}}],"characters":"Game_N","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-122","height":"h-38","margin-left":"ml-119","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-1160","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_O-B25B1E-441E1A","type":"FRAME","x":1540,"y":550,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.6980392336845398,"g":0.35686275362968445,"b":0.11764705926179886},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_O","type":"TEXT","x":119.5,"y":103.5,"width":121,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.2666666805744171,"g":0.11764705926179886,"b":0.10196078568696976},"boundVariables":{}}],"characters":"Game_O","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-121","height":"h-38","margin-left":"ml-120","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-1540","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_P-34A9E9-E7DC4F","type":"FRAME","x":20,"y":815,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.9058823585510254,"g":0.8627451062202454,"b":0.30980393290519714},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_P","type":"TEXT","x":119.5,"y":103.5,"width":121,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.20392157137393951,"g":0.6627451181411743,"b":0.9137254953384399},"boundVariables":{}}],"characters":"Game_P","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-121","height":"h-38","margin-left":"ml-120","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-20","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_Q-E877B6-FFFAB9","type":"FRAME","x":400,"y":815,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":1,"g":0.9803921580314636,"b":0.7254902124404907},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_Q","type":"TEXT","x":119.5,"y":103.5,"width":121,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.9098039269447327,"g":0.46666666865348816,"b":0.7137255072593689},"boundVariables":{}}],"characters":"Game_Q","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-121","height":"h-38","margin-left":"ml-120","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-400","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_R-995DE1-3B1C5F","type":"FRAME","x":780,"y":815,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.23137255012989044,"g":0.10980392247438431,"b":0.37254902720451355},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_R","type":"TEXT","x":119,"y":103.5,"width":122,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.6012435555458069,"g":0.3629470765590668,"b":0.8811473846435547},"boundVariables":{}}],"characters":"Game_R","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-122","height":"h-38","margin-left":"ml-119","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-780","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_S-034240-ED795D","type":"FRAME","x":1160,"y":815,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.929411768913269,"g":0.4745098054409027,"b":0.364705890417099},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_S","type":"TEXT","x":119.5,"y":103.5,"width":121,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.0117647061124444,"g":0.25882354378700256,"b":0.250980406999588},"boundVariables":{}}],"characters":"Game_S","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-121","height":"h-38","margin-left":"ml-120","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-1160","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}},{"name":"GAME_T-E34251-94E21F","type":"FRAME","x":1540,"y":815,"width":360,"height":245,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.5803921818733215,"g":0.886274516582489,"b":0.12156862765550613},"boundVariables":{}}],"cornerRadius":20,"children":[{"name":"Game_T","type":"TEXT","x":120.5,"y":103.5,"width":119,"height":38,"fills":[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":0.8901960849761963,"g":0.25882354378700256,"b":0.3176470696926117},"boundVariables":{}}],"characters":"Game_T","fontSize":48,"fontName":{"family":"Monigue DEMO","style":"Regular"},"textAlignHorizontal":"RIGHT","textAlignVertical":"CENTER","lineHeight":{"unit":"PERCENT","value":80.0000011920929},"tailwind":{"width":"w-119","height":"h-38","margin-left":"ml-121","font-size":"text-48"}}],"layoutMode":"VERTICAL","primaryAxisSizingMode":"FIXED","counterAxisSizingMode":"FIXED","primaryAxisAlignItems":"CENTER","counterAxisAlignItems":"CENTER","itemSpacing":10,"tailwind":{"width":"w-360","height":"h-245","margin-left":"ml-1540","flex":"flex flex-col gap-10","justify-content":"justify-center","align-items":"items-center"}}]`

type Active = {
  item: GridItem
  rect: DOMRect
}

export function GridView() {
  const [paste, setPaste] = useState(() => {
    const saved = window.localStorage.getItem('tl.grid.layers')
    return saved ?? defaultPaste
  })
  const [active, setActive] = useState<Active | null>(null)
  const [useJson, setUseJson] = useState(() => {
    const saved = window.localStorage.getItem('tl.grid.useJson')
    return saved === 'true'
  })
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    window.localStorage.setItem('tl.grid.layers', paste)
  }, [paste])

  useEffect(() => {
    window.localStorage.setItem('tl.grid.useJson', useJson.toString())
  }, [useJson])

  const items = useMemo(() => {
    if (useJson) {
      return parseFigmaJson(figmaJsonData)
    } else {
      return parseGridLayerList(paste)
    }
  }, [paste, useJson])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b border-zinc-800 p-4">
        <div className="text-sm font-medium text-zinc-100">Grid View</div>
        <div className="mt-1 text-xs text-zinc-400">
          {useJson 
            ? "Using imported Figma JSON data with 20 game tiles."
            : "Paste Figma layer names from the \"Grid View\" page (one per line). Format:"
          }
          {!useJson && <span className="ml-1 font-mono">TEXT-FGHEX-BGHEX</span>}
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <button
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                useJson 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
              onClick={() => setUseJson(true)}
            >
              Figma JSON
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                !useJson 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
              onClick={() => setUseJson(false)}
            >
              Paste Mode
            </button>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            {useJson ? (
              <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-400">
                <div className="text-zinc-200">Loaded from Figma JSON</div>
                <div className="mt-2">JSON data contains {items.length} tiles with exact colors and text from your Figma file.</div>
              </div>
            ) : (
              <textarea
                className="min-h-[84px] w-full resize-y rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 font-mono text-xs text-zinc-100"
                value={paste}
                onChange={(e) => setPaste(e.target.value)}
              />
            )}
            <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-400">
              <div className="text-zinc-200">Parsed items: {items.length}</div>
              <div className="mt-2">
                {useJson 
                  ? "Tiles generated from Figma JSON with exact colors and positioning."
                  : "No hardcoding — tiles are generated only from these lines."
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <button
              key={item.id}
              className="relative aspect-[1/1] w-full overflow-visible rounded-xl text-left"
              style={{ background: item.bgColor }}
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                setActive({ item, rect })
              }}
            >
              <div
                className="absolute inset-0 rounded-xl"
                style={{ background: item.bgColor }}
              />
              <div
                className="absolute inset-0 flex items-end p-3"
                style={{ color: item.textColor }}
              >
                <div
                  className="text-lg font-medium tracking-tight"
                  style={{ opacity: active?.item.id === item.id ? 0 : 1, transition: 'opacity 200ms ease' }}
                >
                  {item.text}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <GridViewOverlay
        active={active}
        onClose={() => setActive(null)}
      />
    </div>
  )
}
