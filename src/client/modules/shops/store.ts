import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";
import { TriggerServerCallbackAsync } from "../../core/utils";
import { Cardealer } from "./cardealer";

export abstract class Store {
    public static data = {
        coins: 150000
    }

    public static async initialize() {
        Nui.RegisterCallback("leave", () => this.close());

        Nui.RegisterCallback("buyMecano", () => this.buyMecano());
        Nui.RegisterCallback("buyFarmCompany", () => this.buyFarmCompany());
        Nui.RegisterCallback("buyOrganisation", () => this.buyOrganisation());
        Nui.RegisterCallback("reclameVip", () => this.reclameVip());
        Nui.RegisterCallback("exclusiveVehicle", () => this.exclusiveVehicle());

        Nui.RegisterCallback("openCase", (caseLevel: string) => this.openCase(caseLevel));
        Nui.RegisterCallback("buyWeapon", (data: any) => this.buyWeapon(data));
        Nui.RegisterCallback("openVehicles", (data: any) => this.openVehicles());
        Nui.RegisterCallback("buyStoreVehicles", (data: any) => this.buyStoreVehicles(data));

        RegisterCommand('boutique', async () => {
            const coins = await TriggerServerCallbackAsync("hoyame:store:getCoins");
            const code = await TriggerServerCallbackAsync("hoyame:store:getCode");

            Nui.SendMessage({ path: "shop/case" });
            await Delay(10)
            Nui.SendMessage({ type: "store", coins: coins, code: code });
            Nui.SetFocus(true, true, false);
            DisplayRadar(false);
        }, false)
 
        RegisterKeyMapping('boutique', 'Boutique', 'keyboard', 'f1')
    }

    private static async openVehicles() {
        await Cardealer.tp()
        setTimeout(() => Cardealer.enableCam('storeshop'), 1000)
        
    }

    private static buyStoreVehicles(v: any) {
        TriggerServerEvent('aBoutique:BuyVehicle', v.model, v.price, v.label)
    }

    private static async openCase(caseLevel: string) {
        const actuallyCase = await TriggerServerCallbackAsync("hoyame:store:grabCaisse", caseLevel);
        Nui.SendMessage({ type: "store/case", data: actuallyCase });
        console.log(actuallyCase);
    }

    private static buyWeapon(data: any) {
        emitNet('hoyame_d:buyweapon', data.name, data.price, data.label);
        this.close()
    }
    
    private static buyMecano() { emitNet('aBoutique:Mecano'); this.close() }
    private static buyFarmCompany() {  emitNet('aBoutique:Entreprise'); this.close() }
    private static buyOrganisation() {  emitNet('aBoutique:Illegal'); this.close() }
    private static reclameVip() {  emitNet('gm:reclame_vip'); this.close() }
    private static exclusiveVehicle() {  emitNet('gm:store:buyLimitedVehicle'); this.close() }

    public static close() {
        Nui.SendMessage({ path: "" });
        Nui.SetFocus(false, false, false);
        Cardealer.returnTp();
        // TriggerScreenblurFadeOut(500)
    }
}