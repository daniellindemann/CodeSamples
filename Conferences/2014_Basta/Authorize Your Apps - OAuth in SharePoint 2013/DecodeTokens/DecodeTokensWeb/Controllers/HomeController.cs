using System.IdentityModel.Tokens;
using System.Web.Mvc;
using Microsoft.Ajax.Utilities;
using Microsoft.IdentityModel.S2S.Tokens;
using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DocodeTokensWeb.Controllers
{
	public class HomeController : Controller
	{
		[SharePointContextFilter]
		public ActionResult Index()
		{
			// this is a post request !!!

			// plain context token string
			string contextToken = TokenHelper.GetContextTokenFromRequest(HttpContext.Request);
			ViewBag.ContextToken = contextToken;

			// decode sharepoint context token
			JsonWebSecurityTokenHandler tokenHandler = TokenHelper.CreateJsonWebSecurityTokenHandler();
			SecurityToken token = tokenHandler.ReadToken(contextToken);
			var jsonToken = token as JsonWebSecurityToken;
			SharePointContextToken spContextToken = SharePointContextToken.Create(jsonToken);
			ViewBag.DecodedContextToken = spContextToken.ToString();


			// access token
			var hostWeb = new Uri(Request.QueryString["SPHostUrl"]);
			string accessToken = TokenHelper.GetAccessToken(spContextToken, hostWeb.Authority).AccessToken;
			ViewBag.AccessToken = accessToken;

			// decode access token
			// nuget: System.IdentityModel.Tokens.Jwt
			var jwtHandler = new JwtSecurityTokenHandler();
			var securityToken = jwtHandler.ReadToken(accessToken);
			ViewBag.DecodedAccessToken = securityToken.ToString();

			return View();
		}

		public ActionResult About()
		{
			ViewBag.Message = "Your application description page.";

			return View();
		}

		public ActionResult Contact()
		{
			ViewBag.Message = "Your contact page.";

			return View();
		}
	}
}
