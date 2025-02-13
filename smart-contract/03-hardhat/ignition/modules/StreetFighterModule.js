import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

////////////////////////////
// StreetFighterModule
////////////////////////////

const StreetFighterModule = buildModule("StreetFighter", (m) => {

    const StreetFighter = m.contract("StreetFighter");

    return { StreetFighter };
});

export default StreetFighterModule;
