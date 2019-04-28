// dnSpy decompiler from Assembly-CSharp.dll class: Routes
using System;

public static class Routes
{
	public static string ErepublikRegister
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-register";
		}
	}

	public static string SecureAccount
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-sync-account";
		}
	}

	public static string ErepublikLogin
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-login";
		}
	}

	public static string ErepublikDisconnectAccount
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-disconnect-account";
		}
	}

	public static string Logout
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-logout";
		}
	}

	public static string RegisterFCMToken
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-connect";
		}
	}

	public static string SendNotificationTrackingId
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-track-notifications";
		}
	}

	public static string GetUserData
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-get-user-data";
		}
	}

	public static string GetGameData
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-get-game-data";
		}
	}

	public static string GetCityData
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-get-city-data";
		}
	}

	public static string CometchatSendMessage
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/cometchat-room-send";
		}
	}

	public static string CometchatSendHeartbeat
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/cometchat-heartbeat";
		}
	}

	public static string GetMissionsStatus
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-get-mission-data";
		}
	}

	public static string CollectMissionReward
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "/en/main/mission-solve?missionId=";
		}
	}

	public static string GetBattles
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-war-list";
		}
	}

	public static string GetInbox
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "/en/main/mobile-message-inbox";
		}
	}

	public static string GetConversations(string threadId)
	{
		return GameEnvironment.Instance.ActiveServer + "/en/main/mobile-message-read?thread_id=" + threadId;
	}

	public static string GetAlerts
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "/en/main/mobile-message-alerts";
		}
	}

	public static string SendMailMessage
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "/en/main/mobile-message-compose";
		}
	}

	public static string GetFriendSuggestions
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "/en/main/citizen-get-friends-list";
		}
	}

	public static string DeleteMessages
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "/en/main/mobile-message-delete";
		}
	}

	public static string ActionToAlerts
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "/en/main/alertActions";
		}
	}

	public static string GetTrainingGrounds
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-training-grounds";
		}
	}

	public static string TrainAction
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-train";
		}
	}

	public static string GetWorkData
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-work-data";
		}
	}

	public static string WorkAction
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-work";
		}
	}

	public static string ResignAction
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-resign";
		}
	}

	public static string GetJobMarket
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-job-market?page=";
		}
	}

	public static string ApplyForJob
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-job-apply";
		}
	}

	public static string GetMarketplaceOffers
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-marketplace";
		}
	}

	public static string BuyFromMarketplace
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-marketplace-buy";
		}
	}

	public static string GetDonateItems
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "/en/main/mobile-donate-items-data";
		}
	}

	public static string DonateToUser
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "/en/main/mobile-donate-items";
		}
	}

	public static string GetStorageItems
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-inventory";
		}
	}

	public static string GetBattlefieldInventory
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-battlefield-inventory";
		}
	}

	public static string GetBattleHistory
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-fight-history";
		}
	}

	public static string DeployBattlefield
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-deploy";
		}
	}

	public static string CancelDeploy
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-deploy-cancel";
		}
	}

	public static string GetBattlefieldConsole
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/military/mobile-battlefield-console";
		}
	}

	public static string GetBattlefieldBombs
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-battlefield-inventory-bombs";
		}
	}

	public static string DeployBombOnBattlefield
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-deploy-bomb";
		}
	}

	public static string GetCombatOrders(string battleId)
	{
		return GameEnvironment.Instance.ActiveServer + "en/main/mobile-combat-orders-list?battle_id=" + battleId;
	}

	public static string SubscribeToCombatOrder
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-combat-orders-subscribe";
		}
	}

	public static string GetTravelData
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-travel-popup";
		}
	}

	public static string TravelAction
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-travel";
		}
	}

	public static string GetFastTravelData
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-select-side-popup";
		}
	}

	public static string SetSide
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-select-side";
		}
	}

	public static string GetDivisionAndSideSwitchData
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-switch-division-popup";
		}
	}

	public static string SwitchSideAndDivisionAction
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-switch";
		}
	}

	public static string GetBoosterTypes
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/military/mobile-boosters";
		}
	}

	public static string ActivateBooster
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-activate-boosters";
		}
	}

	public static string GetWeeklyChallengeData
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-weekly-challenge";
		}
	}

	public static string CollectWeeklyChallengeReward
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-weekly-challenge-collect";
		}
	}

	public static string GetEnergyData
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-energy-data";
		}
	}

	public static string RecoverEnergyAction
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-energy-eat";
		}
	}

	public static string GetShopItems
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-shop-gold-items";
		}
	}

	public static string BuyGoldItems
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-buy";
		}
	}

	public static string ValidateIapPurchase
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-purchase";
		}
	}

	public static string DailyGoldCollect
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-collect-daily-gold";
		}
	}

	public static string GetPlayerData(int playerId)
	{
		return GameEnvironment.Instance.ActiveServer + "en/main/mobile-player-card/" + playerId;
	}

	public static string PlayerAddRemoveFriend
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-addRemoveFriend";
		}
	}

	public static string CitizenSearch
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/citizen-search";
		}
	}

	public static string GetOnboardingCountryList
	{
		get
		{
			return GameEnvironment.Instance.ActiveServer + "en/main/mobile-get-onboarding-countries";
		}
	}
}
