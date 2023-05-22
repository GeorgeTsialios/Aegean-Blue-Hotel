import { AccountLevel } from "../../model/accountLevel.mjs";

async function returnAccountLevels() {
    return await AccountLevel.queryAccountLevels();
}

export { returnAccountLevels }