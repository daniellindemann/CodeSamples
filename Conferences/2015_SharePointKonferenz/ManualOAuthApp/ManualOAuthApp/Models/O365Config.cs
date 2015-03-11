using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace ManualOAuthApp.Models
{
	public static class O365Config
	{
		private static string _authorizationEndPointUrlTemplate = "https://login.windows.net/{0}/oauth2/authorize?api-version=1.0";
      private static string _tokenEndPointUrlTemplate = "https://login.windows.net/{0}/oauth2/token?api-version=1.0";
		private static string _tentantID = ConfigurationManager.AppSettings["demo:TenantId"];
		private static string _tenant = ConfigurationManager.AppSettings["demo:Tenant"];
		private static string _outlookEndPointUrl = "https://outlook.office365.com";

		public static string Tenant => _tenant;
		public static string TenantID => _tentantID;
		public static string AuthorizationEndPointUrl => string.Format(_authorizationEndPointUrlTemplate, TenantID);
		public static string TokenEndPointUrl => string.Format(_tokenEndPointUrlTemplate, TenantID);
		public static string OutlookEndPointUrl => _outlookEndPointUrl;
	}
}