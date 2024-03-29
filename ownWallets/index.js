"use strict";

import { Buffer } from "buffer";


let private_walletInterface_hasBlockFrost = false;
class Wallet
{
  /**
   * @private
   */
  static _api_key = undefined;

  /**
   * @private
   */
  static _protocolParameters = undefined;

  // ---------------------------------------- nami objects ---------------------------------------- //
  /**
   * @private
   */
  static _namiObj = undefined;

  /**
   * @private
   */
   static _namiInterface = undefined;

  /**
   * @private
   */
  static _NamiWallet = undefined;

  // ---------------------------------------- ccvault objects ---------------------------------------- //
  
  /**
   * @private
   */
  static _ccvaultObj = undefined;

  /**
   * @private
   */
   static _ccvaultInterface = undefined;
  
  /**
   * @private
   */
  static _CCVaultWallet = undefined;


   // ---------------------------------------- flint objects ---------------------------------------- //

  /**
   * @private
   */
   static _flintObj = undefined;

   /**
   * @private
   */
    static _flintInterface = undefined;
  
   /**
    * @private
    */
   static _flintWallet = undefined;

   // ---------------------------------------- yoroi objects ---------------------------------------- //

  /**
   * @private
   */
    static _yoroiObj = undefined;

    /**
   * @private
   */
     static _yoroiInterface = undefined;

    /**
    * @private
    */
    static _yoroiWallet = undefined;

    // ---------------------------------------- gero objects ---------------------------------------- //

  /**
   * @private
   */
   static _geroObj = undefined;

   /**
   * @private
   */
    static _geroInterface = undefined;

   /**
   * @private
   */
   static _geroWallet = undefined;

  // ---------------------------------------- Typhon objects ---------------------------------------- //
  /**
   * @private
   */
  static _typhonObj = undefined;

  /**
   * @private
   */
   static _typhonInterface = undefined;

  /**
   * @private
   */
  static _TyphonWallet = undefined;

  // ---------------------------------------- cardWallet objects ---------------------------------------- //
  /**
   * @private
   */
   static _cardWalletObj = undefined;

   /**
    * @private
    */
    static _cardWalletInterface = undefined;
 
   /**
    * @private
    */
   static _CardWalletWallet = undefined;

  // ---------------------------------------- wallet utils ---------------------------------------- //

  static _assertBrowser()
  {
    if( typeof window === "undefined" ) throw new Error("can check for any cardano wallet extension only in a browser environment");
  }

  static Names = Object.freeze({
    Nami: "Nami",
    CCVault: "ccvault",
    Flint: "Flint Wallet",
    Yoroi: "yoroi",
    Gero: "GeroWallet",
    Typhon: "Typhon Wallet",
    Cardwallet: "CardWallet"
  });

  // dynamicaly generated so that any change is updated immediately
  static stringNames = Object.freeze(
    Object.keys( Wallet.Names )
    .map( walletName => Wallet.Names[ walletName ] )
  );

  static utils = {
    getStringFromWalletName: Wallet._getStringFromWalletName,
    getWalletNameFromString: Wallet._getWalletNameFromString
  }

  static _getStringFromWalletName( walletNameEnum )
  {
      const invalidSymbolError = new Error("walletNameEnum must be a property of the Wallet.Names enum object");;
      // if( typeof walletNameEnum !== "symbol" ) throw invalidSymbolError;
      if( !Wallet.stringNames.includes( walletNameEnum ) ) throw invalidSymbolError;

      return walletNameEnum;
  }

  static _getWalletNameFromString( string )
  {
      const invalidString = new Error("getWalletNameFromString parameter must be a valid wallet string name");

      if( typeof string !== "string" )    throw invalidString;
      if( !Wallet.stringNames.includes(string) ) throw invalidString;

      return string;
  }






  // --------------------------- WORLD INTERACTION ----------------------------- //

  /**
   * 
   * @param {string} blockfrost_project_id blockforst api key to be used
   */
  static setBlockfrost( blockfrost_project_id )
  {    
    if( typeof blockfrost_project_id !== "string" ) throw new Error("blockfrost_project_id must be a string")
    
    Wallet._api_key = blockfrost_project_id;
    
    private_walletInterface_hasBlockFrost = true;
  }
  
  static async makeBlockfrostRequest( endpoint, headers, body )
  {
    if( !private_walletInterface_hasBlockFrost ) throw new Error("Wallet.setBlockfrost has not been called, can't use Wallet.makeBlockfrostRequest")
    return await private_blockfrostRequest( Wallet._api_key, endpoint, headers, body );
  }

  static hasProtocolParameters()
  {
    return ( Wallet._protocolParameters !== undefined );
  }

  static async getProtocolParameters( blockfrost_project_id = undefined )
  {

    if( !Wallet.hasProtocolParameters() )
    {
      let api_key_toUse = "";

      if( typeof blockfrost_project_id === "string" )
      {
        api_key_toUse = blockfrost_project_id;
      }
      else
      {
        if( !private_walletInterface_hasBlockFrost ) throw new Error("Wallet.setBlockfrost has not been called, can't use Wallet.getProtocolParameters")

        api_key_toUse = Wallet._api_key;
      }

      Wallet._protocolParameters = await private_getProtocolParameters( api_key_toUse );
    }

    return Wallet._protocolParameters;
  }

  static get protocolParameters()
  {
    if( !Wallet.hasProtocolParameters() ) throw new Error("protocolParameters never checked before, call the async version Wallet.getProtocolParameters first");
    
    return Wallet._protocolParameters;
  }









  // ----------------------------------------------- Wallet common --------------------------------------------------- //

  /**
   * 
   * @deprecated library is no longer based on symbols
   */
  static _assertWalletNameIsSym( wallet )
  {
    // if( typeof walletName !== "symbol" ) throw new WalletProcessError("a wallet identifier should be a member of the ```Wallet.Names``` enumeration");
    if( typeof wallet !== "string" )
      throw new Error("a wallet identifier should be a member of the ```Wallet.Names``` enumeration");
    if( !Wallet.stringNames.includes( wallet ) )
      throw new Error("a wallet identifier should be a member of the ```Wallet.Names``` enumeration");
  }

  /**
   * 
   * @param {string} walletName
   * @throws {WalletProcessError} if the string passed is not included in the Wallet.stringNames array 
   */
  static _assertWalletNameIsValid( walletName )
  {
    if( typeof walletName !== "string" )
      throw new Error("a wallet identifier should be a member of the ```Wallet.Names``` enumeration");
    if( !Wallet.stringNames.includes( walletName ) )
      throw new Error("a wallet identifier should be a member of the ```Wallet.Names``` enumeration");
  }

  static _assertWalletExtensionInjected( walletName )
  {
    Wallet._assertWalletNameIsValid( walletName );

    if( !Wallet.has( walletName ) ) throw new Error("can't access the "+walletName+" object if the "+walletName+" extension is not installed");
  }
  


  /**
   * 
   * @param {Wallet.WalletStringName} wallet member of the Wallet.Names enum object
   * @returns {boolean} ```true``` if the extension has been injected, ```false``` otherwise
   */
  static has( wallet )
  {
    Wallet._assertBrowser();
    Wallet._assertWalletNameIsValid( wallet );

    switch( wallet )
    {
      /*
      if you need to modify the cases please make sure
      any change is made also in the Wallet.Names object
      */
      case Wallet.Names.Nami:               return !!window?.cardano?.nami;
      case Wallet.Names.CCVault:            return !!window?.cardano?.ccvault;
      case Wallet.Names.Flint:              return !!window?.cardano?.flint;
      case Wallet.Names.Yoroi:              return !!window?.cardano?.yoroi;
      case Wallet.Names.Gero:               return !!window?.cardano?.gerowallet;
      case Wallet.Names.Typhon:             return !!window?.cardano?.typhon;
      case Wallet.Names.Cardwallet:         return !!window?.cardano?.cardwallet;

      default: throw new Error("invalid argument; wallet name should be a member of the WalleName enumeration object")
    }
  }

  /**
   * 
   * @param {Wallet.WalletStringName} wallet: element of Wallet.name enumerative object 
   * @returns {Wallet.Wallet} the dApp connecctor corresponding to the name
   */
  static get( wallet )
  {
    Wallet._assertBrowser();
    Wallet._assertWalletNameIsValid( wallet );
   
    switch( wallet )
    {
      /*
      if you need to modify the cases please make sure
      any change is made also in the Wallet.Names object
      */
      case Wallet.Names.Nami:               return Wallet.Nami;
      case Wallet.Names.CCVault:            return Wallet.CCVault;
      case Wallet.Names.Flint:              return Wallet.Flint;
      case Wallet.Names.Yoroi:              return Wallet.Yoroi;
      case Wallet.Names.Gero:               return Wallet.Gero;
      case Wallet.Names.Typhon:             return Wallet.Typhon;
      case Wallet.Names.Cardwallet:         return Wallet.Cardwallet;

      default: throw new Error("invalid argument; wallet name should be a member of the WalleName enumeration object")
    }
  }

  /**
   * 
   * @param {Wallet.WalletStringName} wallet: element of Wallet.name enumerative object
   * @returns {Wallet.WalletInterface} initial API that allows enabling wallet
   */
  static getInterface( wallet )
  {
    Wallet._assertBrowser();
    Wallet._assertWalletNameIsValid( wallet );

    if( wallet === Wallet.Names.Nami )
    {
      return Wallet.NamiInterface;
    }
    else if( wallet === Wallet.Names.CCVault )
    {
      return Wallet.CCVaultInterface;
    }
    else if( wallet === Wallet.Names.Flint )
    {
      return Wallet.FlintInterface;
    }
    else if( wallet === Wallet.Names.Gero )
    {
      return Wallet.GeroInterface;
    }
    else if( wallet === Wallet.Names.Typhon )
    {
      return Wallet.TyphonInterface;
    }
    else if( wallet === Wallet.Names.Yoroi )
    {
      return Wallet.YoroiInterface;
    }
    else if( wallet === Wallet.Names.Cardwallet )
    {
      return Wallet.CardwalletInterface;
    }
    else throw new Error("invalid argument; wallet name should be a member of the Wallet.Names enumeration object")
  }
  
  /**
   * 
   * @param {Wallet.WalletStringName} wallet member of the Wallet.Names enum object
   */
  static async enable( wallet )
  {
    Wallet._assertWalletExtensionInjected( wallet );

    switch( wallet )
    {
      /*
      if you need to modify the cases please make sure
      any change is made also in the Wallet.Names object
      */
      case Wallet.Names.Nami:               
        Wallet._namiObj = await window.cardano.nami.enable();
        return; break;

      case Wallet.Names.CCVault:            
        Wallet._ccvaultObj = await window.cardano.ccvault.enable();
        return; break;

      case Wallet.Names.Flint:
        Wallet._flintObj = await window.cardano.flint.enable();
      return; break;

      case Wallet.Names.Yoroi:              
        Wallet._yoroiObj = await window.cardano.yoroi.enable();
        return; break;

      case Wallet.Names.Gero:               
        Wallet._geroObj = await window.cardano.gerowallet.enable();
        return; break;

      case Wallet.Names.Typhon:
        let tResult =  await window.cardano.typhon.enable();
        if( tResult.status )
        {
          Wallet._typhonObj = window.cardano.typhon;
        }
        else throw new Error("user rejected typhon connection")
      return;
      break;
      case Wallet.Names.Cardwallet:
        Wallet._cardWalletObj = await window.cardano.cardwallet.enable();
        return;
      break;

      default: throw new Error("invalid argument; wallet name should be a member of the WalleName enumeration object")
    }
  }

  /**
   * 
   * @param {Wallet.WalletStringName} wallet member of the Wallet.Names enum object
   * @returns {boolean} ```true``` if the user wallet is connected, ```false``` otherwise
   */
  static async isEnabled( wallet )
  {
    Wallet._assertWalletExtensionInjected( wallet );

    let walletIsEnabled = false;

    switch( wallet )
    {
      /*
      if you need to modify the cases please make sure
      any change is made also in the Wallet.Names object
      */
      case Wallet.Names.Nami:               
        walletIsEnabled = await window.cardano.nami.isEnabled();
      break;
        
      case Wallet.Names.CCVault:            
        walletIsEnabled = await window.cardano.ccvault.isEnabled();
      break;
        
      case Wallet.Names.Flint:
        walletIsEnabled = await window.cardano.flint.isEnabled();
      break;
        
      case Wallet.Names.Yoroi:              
        walletIsEnabled = await window.cardano.yoroi.isEnabled();
      break;
        
      case Wallet.Names.Gero:               
        walletIsEnabled = await window.cardano.gerowallet.isEnabled();
      break;

      case Wallet.Names.Typhon:
        let {status, data} = await window.cardano.typhon.isEnabled();
        walletIsEnabled = data && status;
      break;

      case Wallet.Names.Cardwallet:
        walletIsEnabled = await window.cardano.cardwallet.isEnabled();
      break;

      default: throw new Error("invalid argument; wallet name should be a member of the WalleName enumeration object")
    }

    if( walletIsEnabled )
    {
      Wallet.enable( wallet );
      return true;
    }
    else
    {
      return false;
    };

  }

  /**
   * 
   * @param {Wallet.WalletStringName} wallet member of the Wallet.Names enum object
   */
  static isAviable( wallet )
  {
    // Wallet._assertBrowser() not needed since checks into the Wallet class only
    Wallet._assertWalletNameIsValid( wallet );

    switch( wallet )
    {
      /*
      if you need to modify the cases please make sure
      any change is made also in the Wallet.Names object
      */
      case Wallet.Names.Nami:               return ( Wallet._namiObj !== undefined );
      case Wallet.Names.CCVault:            return ( Wallet._ccvaultObj !== undefined );
      case Wallet.Names.Flint:              return ( Wallet._flintObj !== undefined );
      case Wallet.Names.Yoroi:              return ( Wallet._yoroiObj !== undefined );
      case Wallet.Names.Gero:               return ( Wallet._geroObj !== undefined );
      case Wallet.Names.Typhon:             return ( Wallet._typhonObj !== undefined );
      case Wallet.Names.Cardwallet:         return ( Wallet._cardWalletObj !== undefined )

      default: throw new Error("invalid argument; wallet name should be a member of the WalleName enumeration object")
    }
  }










  // ---------------------------------------- Nami ---------------------------------------- //

  static get NamiInterface()
  {
    if( !Wallet.has( Wallet.Names.Nami ) ) throw new Error("can't access the nami object if the nami extension is not installed");

    if( Wallet._namiInterface === undefined )
    {
      Wallet._namiInterface = private_makeWalletInterface( Wallet.Names.Nami );
    }
    
    return Wallet._namiInterface;
  }

  static get Nami()
  {
    if( !Wallet.has( Wallet.Names.Nami ) ) throw new Error("can't access the Nami object if the nami extension is not installed");
    if( !Wallet.isAviable( Wallet.Names.Nami ) ) throw new Error("Wallet.enableNami has never been called before, can't access the Nami wallet object");

    if( Wallet._NamiWallet === undefined )
    {
      Wallet._NamiWallet = private_makeWallet( Wallet._namiObj, Wallet._api_key )
    }

    return Wallet._NamiWallet;
  }
  
  // ---------------------------------------- ccvault ---------------------------------------- //

  static get CCVaultInterface()
  {
    if( !Wallet.has( Wallet.Names.CCVault ) ) throw new Error("can't access the ccvault object if the ccvault extension is not installed");

    if( Wallet._ccvaultInterface === undefined )
    {
      Wallet._ccvaultInterface = private_makeWalletInterface( Wallet.Names.CCVault );
    }
    
    return Wallet._ccvaultInterface;
  }

  static get CCVault()
  {
    if( !Wallet.has( Wallet.Names.CCVault ) ) throw new Error("can't access the CCVault object if the CCVault extension is not installed");
    if( !Wallet.isAviable( Wallet.Names.CCVault ) ) throw new Error("Wallet.enableCCVault has never been called before, can't access the CCVault wallet object");

    if( Wallet._CCVaultWallet === undefined )
    {
      Wallet._CCVaultWallet = private_makeWallet( Wallet._ccvaultObj, Wallet._api_key )
    }

    return Wallet._CCVaultWallet;
  }

 

  // ---------------------------------------- flint TODO ToDo todo ---------------------------------------- //
  
  static get FlintInterface()
  {
    if( !Wallet.has( Wallet.Names.Flint ) ) throw new Error("can't access the flint object if the flint extension is not installed");

    if( Wallet._flintInterface === undefined )
    {
      Wallet._flintInterface = private_makeWalletInterface( Wallet.Names.Flint );
    }
    
    return Wallet._flintInterface;
  }

  static get Flint()
  {
    if( !Wallet.has( Wallet.Names.Flint ) ) throw new Error("can't access the flint object if the flint extension is not installed");
    if( !Wallet.isAviable( Wallet.Names.Flint ) ) throw new Error("Wallet.enableFlint has never been called before, can't access the flint wallet object");

    if( Wallet._flintWallet === undefined )
    {
      Wallet._flintWallet = private_makeWallet( Wallet._flintWallet, Wallet._api_key )
    }

    return Wallet._flintWallet;
  }

  // ---------------------------------------- yoroi ---------------------------------------- //

  static get YoroiInterface()
  {
    if( !Wallet.has( Wallet.Names.Yoroi ) ) throw new Error("can't access the yoroi object if the yoroi extension is not installed");

    if( Wallet._yoroiInterface === undefined )
    {
      Wallet._yoroiInterface = private_makeWalletInterface( Wallet.Names.Yoroi );
    }
    
    return Wallet._yoroiInterface;
  }

  static get Yoroi()
  {
    if( !Wallet.has( Wallet.Names.Yoroi ) ) throw new Error("can't access the Yoroi object if the Yoroi nigthly extension is not installed");
    if( !Wallet.isAviable( Wallet.Names.Yoroi ) ) throw new Error("Wallet.enableYoroi has never been called before, can't access the Yoroi interface");

    if( Wallet._yoroiWallet === undefined )
    {
      Wallet._yoroiWallet = private_makeWallet( Wallet._yoroiObj, Wallet._api_key )
    }

    return Wallet._yoroiWallet;
  }

  // ---------------------------------------- gerowallet ---------------------------------------- //

  static get GeroInterface()
  {
    if( !Wallet.has( Wallet.Names.Gero ) ) throw new Error("can't access the gero object if the gerowallet extension is not installed");

    if( Wallet._geroInterface === undefined )
    {
      Wallet._geroInterface = private_makeWalletInterface( Wallet.Names.Gero );
    }
    
    return Wallet._geroInterface;
  }

  static get Gero()
  {
    if( !Wallet.has( Wallet.Names.Gero ) ) throw new Error("can't access the Gero object if the Gero Wallet extension is not installed");
    if( !Wallet.isAviable( Wallet.Names.Gero ) ) throw new Error("Wallet.enableGero has never been called before, can't access the Gero interface");

    if( Wallet._geroWallet === undefined )
    {
      Wallet._geroWallet = private_makeWallet( Wallet._geroObj, Wallet._api_key )
    }

    return Wallet._geroWallet;
  }

  // ---------------------------------------- typhon ---------------------------------------- //

  
  static get TyphonInterface()
  {
    if( !Wallet.has( Wallet.Names.Typhon ) ) throw new Error("can't access the Typhon object if the Typhon extension is not installed");

    if( Wallet._typhonInterface === undefined )
    {
      Wallet._typhonInterface = private_makeWalletInterface( Wallet.Names.Typhon );
    }
    
    return Wallet._typhonInterface;
  }

  static get Typhon()
  {
    if( !Wallet.has( Wallet.Names.Typhon ) ) throw new Error("can't access the Typhon object if the Typhon Wallet extension is not installed");
    if( !Wallet.isAviable( Wallet.Names.Typhon ) ) throw new Error("Wallet.enable( Wallet.Names.Typhon ) has never been called before, can't access the Typhon interface");

    if( Wallet._TyphonWallet === undefined )
    {
      Wallet._TyphonWallet = private_makeWallet( Wallet._typhonObj, Wallet._api_key )
    }

    return Wallet._TyphonWallet;
  }

  // ---------------------------------------- cardwallet ---------------------------------------- //


  static get CardwalletInterface()
  {
    if( !Wallet.has( Wallet.Names.Cardwallet ) ) throw new Error("can't access the Cardwallet object if the Cardwallet extension is not installed");

    if( Wallet._cardWalletInterface === undefined )
    {
      Wallet._cardWalletInterface = private_makeWalletInterface( Wallet.Names.Cardwallet );
    }
    
    return Wallet._cardWalletInterface;
  }

  static get Cardwallet()
  {
    if( !Wallet.has( Wallet.Names.Cardwallet ) ) throw new Error("can't access the Cardwallet object if the Cardwallet Wallet extension is not installed");
    if( !Wallet.isAviable( Wallet.Names.Cardwallet ) ) throw new Error("Wallet.enable( Wallet.Names.Cardwallet ) has never been called before, can't access the Cardwallet interface");

    if( Wallet._CardWalletWallet === undefined )
    {
      Wallet._CardWalletWallet = private_makeWallet( Wallet._cardWalletObj, Wallet._api_key )
    }

    return Wallet._CardWalletWallet;
  }

}













// ---------------------------------------------------- private --------------------------------------------------------- //

/**
 * 
 * @param {Wallet.WalletStringName} walletStringName member of the Wallet.Names bject which you can import by ```inport { Wallet.Names } from "@harmonicpool/cardano-wallet-interface"```
 * @returns {Wallet.WalletInterface}
1 */
function private_makeWalletInterface( walletStringName )
{
  // I know is private but I don't trust myself
  Wallet._assertBrowser();
  Wallet._assertWalletNameIsValid( walletStringName );

  function getApiVersion()
  {
    switch( walletStringName )
    {
      case Wallet.Names.Nami:              return window?.cardano?.nami?.apiVersion               ? window.cardano.nami.apiVersion : ""; 
      case Wallet.Names.CCVault:           return window?.cardano?.ccvault?.apiVersion            ? window.cardano.ccvault.apiVersion : "";  
      case Wallet.Names.Flint:             return window?.cardano?.flint?.apiVersion              ? window.cardano.flint.apiVersion : ""; 
      case Wallet.Names.Yoroi:             return window?.cardano?.yoroi?.apiVersion              ? window.cardano.yoroi.apiVersion : "";  
      case Wallet.Names.Gero:              return window?.cardano?.gerowallet?.apiVersion         ? window.cardano.gerowallet.apiVersion : "";
      case Wallet.Names.Typhon:            return window?.cardano?.typhon?.apiVersion             ? window.cardano.typhon.apiVersion : "";
      case Wallet.Names.Cardwallet:        return window?.cardano?.cardwallet?.apiVersion         ? window.cardano.cardwallet.apiVersion : "";
      
      default: throw new Error("invalid argument; wallet name should be a member of the WalleName enumeration object")
    }
  }

  function getName()
  {
    switch( walletStringName )
    {
      case Wallet.Names.Nami:              return window?.cardano?.nami?.name               ? window.cardano.nami.name : ""; 
      case Wallet.Names.CCVault:           return window?.cardano?.ccvault?.name            ? window.cardano.ccvault.name : "";  
      case Wallet.Names.Flint:             return window?.cardano?.flint?.name              ? window.cardano.flint.name : ""; 
      case Wallet.Names.Yoroi:             return window?.cardano?.yoroi?.name              ? window.cardano.yoroi.name : "";  
      case Wallet.Names.Gero:              return window?.cardano?.gerowallet?.name         ? window.cardano.gerowallet.name : "";
      case Wallet.Names.Typhon:            return window?.cardano?.typhon?.name             ? window.cardano.typhon.name : "";
      case Wallet.Names.Cardwallet:        return window?.cardano?.cardwallet?.name         ? window.cardano.cardwallet.name : "";

      default: throw new Error("invalid argument; wallet name should be a member of the WalleName enumeration object")
    }
  }

  function getIcon()
  {
    switch( walletStringName )
    {
      case Wallet.Names.Nami:              return window?.cardano?.nami?.icon               ? window.cardano.nami.icon : ""; 
      case Wallet.Names.CCVault:           return window?.cardano?.ccvault?.icon            ? window.cardano.ccvault.icon : "";  
      case Wallet.Names.Flint:             return window?.cardano?.flint?.icon              ? window.cardano.flint.icon : ""; 
      case Wallet.Names.Yoroi:             return window?.cardano?.yoroi?.icon              ? window.cardano.yoroi.icon : "";  
      case Wallet.Names.Gero:              return window?.cardano?.gerowallet?.icon         ? window.cardano.gerowallet.icon : "";
      case Wallet.Names.Typhon:            return window?.cardano?.typhon?.icon             ? window.cardano.typhon.icon : "";
      case Wallet.Names.Cardwallet:        return window?.cardano?.cardwallet?.icon         ? window.cardano.cardwallet.icon : "";
      
      default: throw new Error("invalid argument; wallet name should be a member of the WalleName enumeration object")
    }
  }

  return {
    apiVersion: getApiVersion(),
    icon:       getIcon(),
    name:       getName(),
    isInjected: () => Wallet.has( walletStringName ),
    isAviable:  () => Wallet.isAviable( walletStringName ),
    isEnabled:  () => Wallet.isEnabled( walletStringName ),
    enable:     () => Wallet.enable( walletStringName )
  };

}

/**
 * 
 * @param {RawCip30} WalletProvider 
 * @param {string} defaultBlockfrost_api_key 
 * @returns {Wallet.Wallet}
 */
function private_makeWallet( WalletProvider, defaultBlockfrost_api_key )
{
  
  const submitTransaction = async ( signedTransaction ) =>
  {
    return await private_submitTransaction( WalletProvider, signedTransaction )
  }

  return {
    raw: WalletProvider,
    submitTransaction,
  }
}

async function private_blockfrostRequest( blockfrost_project_id, endpoint, headers, body )
{
  if( typeof blockfrost_project_id !== "string" ) throw Error;

  return await fetch(
    `https://cardano-mainnet.blockfrost.io/api/v0` + endpoint,
    {
      headers: { project_id: blockfrost_project_id },
    }
  ).then((res) => res.json());
};


async function private_getProtocolParameters( blockfrost_project_id )
{
  if( typeof blockfrost_project_id !== "string" ) throw Error;

  // await Loader.load()

  const p = await private_blockfrostRequest( blockfrost_project_id,"/epochs/latest/parameters" );

  return {
    linearFee: LinearFee.new(
      BigNum.from_str(p.min_fee_a.toString()),
      BigNum.from_str(p.min_fee_b.toString())
    ),
    minUtxo: BigNum.from_str(p.min_utxo),
    poolDeposit: BigNum.from_str(p.pool_deposit),
    keyDeposit: BigNum.from_str(p.key_deposit),
    maxValueSize: p.max_val_size,
    maxTxSize: p.max_tx_size,
  };
};


async function private_getRewardAddress ( WalletProvider )
{
  const getRewardAddress =
  // nami || flint
  WalletProvider.getRewardAddress || 
  // CCVault
  WalletProvider.getRewardAddresses

  if( typeof getRewardAddress !== "function" )
  throw new Error(
  "could not find reward address or addresses, probably this is not your fault and the package may need mainatainance, \
  please open an issue at https://github.com/HarmonicPool/cardano-wallet-interface/issues"
  );

  let rawAddress = await getRewardAddress();


  if( Array.isArray(rawAddress) )
  {
    rawAddress = rawAddress[0];
  }
  else if( typeof rawAddress === "object" )
  {
    // typhon
    rawAddress = rawAddress.data;
  }
  
  if( typeof rawAddress !== "string" )
  throw new Error(
    "bad request for getting user reward address, probably not your fault, please open an issue explaining what appened here: https://github.com/HarmonicPool/cardano-wallet-interface/issues"
  );

  return rawAddress;
}


/**
 * 
 * @param {object} WalletProvider an object respecting the CIP30 dApp connector interface 
 * @param {Transaction} signedTransaction 
 * @returns {string} the transaction has you can use to check transaction status
 */
async function private_submitTransaction( WalletProvider, signedTransaction )
{
  // returns the transaction hash
  return await WalletProvider.submitTx(
    Buffer.from( signedTransaction.to_bytes(), "hex").toString("hex")
  );
};

export default Wallet;