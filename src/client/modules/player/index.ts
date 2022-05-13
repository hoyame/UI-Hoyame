// import { ContextMenus } from "../../../shared/data/context";
import { Context } from "../misc/context";
import { Notification } from "../misc/notifications";

export enum ContextMenus {
    None = 0,
    MyPlayer,
}

export abstract class Player {
    public static initialize() {
        Context.registerMenu({
            name: ContextMenus.MyPlayer,
            condition: (data: { id: number | boolean | number[] | { x: number; y: number; }; type: number | boolean | number[] | { x: number; y: number; }; model: number; networkId: number; svId: number; ifMyplayer: boolean; }) => { 
                return data.svId === GetPlayerServerId(PlayerId()) 
            },
            menu: [
                {
                    id: 1,
                    emoji: "🔐",
                    text: "Mon ID",
                    onClick: () => {
                        Notification.show({
                            title: "Mon ID",
                            message: "Mon ID: " + GetPlayerServerId(PlayerId())
                        });
                        Context.close();
                    }
                },
                {
                    id: 2,
                    emoji: "❤️",
                    text: "Ma vie",
                    onClick: () => {
                        Notification.show({
                            title: "Ma vie",
                            message: "HP: " + GetEntityHealth(PlayerPedId())
                        });
                        Context.close();
                    }
                },
            ]
        })
    }
}
