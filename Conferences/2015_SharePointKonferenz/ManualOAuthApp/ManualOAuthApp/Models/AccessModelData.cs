using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManualOAuthApp.Models
{
	public class AccessTokenData
	{
		public string TokenType { get; set; }
		public string Scope { get; set; }
		public string AccessToken { get; set; }
	}
}