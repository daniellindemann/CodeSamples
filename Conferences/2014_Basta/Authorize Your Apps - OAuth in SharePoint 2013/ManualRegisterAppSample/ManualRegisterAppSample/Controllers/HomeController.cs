using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Security;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ManualRegisterAppSample.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
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

		public ActionResult RedirectSuccess()
		{
			var httpContext = this.ControllerContext.HttpContext;
			var request = httpContext.Request;

			string error = request.QueryString["error"] ?? string.Empty;
			string errorDescription = request.QueryString["error_description"] ?? string.Empty;
			string code = request.QueryString["code"] ?? string.Empty;

			ViewBag.OAuthResultError = error;
			ViewBag.OAuthResultErrorDescription = errorDescription;
			ViewBag.OAuthResultCode = code;

			return this.View();
		}

		[HttpPost]
		public ActionResult RedirectSuccess(FormCollection formCollection)
		{
			var site = new Uri(formCollection["devWebUrl"]);
			var realm = TokenHelper.GetRealmFromTargetUrl(site);

			// get access token
			var clientID = formCollection["manualClientId"];
			var clientSecret = formCollection["manualClientSecret"];
			var authorizationCode = formCollection["manualAuthCode"];
			var redirectUri = new Uri(formCollection["redirectUri"]);

			// call token helper customized
			var tokenResponse = TokenHelper.GetAccessToken(clientID, clientSecret, authorizationCode, TokenHelper.SharePointPrincipal, site.Authority, realm, redirectUri);

			TempData["devWebUrl"] = site.ToString();
			TempData["accessToken"] = tokenResponse.AccessToken;
			TempData["refreshToken"] = tokenResponse.RefreshToken;

			return RedirectToAction("GetData");
		}

		public ActionResult GetData()
		{
			ViewBag.DevWebUrl = TempData["devWebUrl"];
			ViewBag.AccessToken = TempData["accessToken"];
			ViewBag.RefreshToken = TempData["refreshToken"];

			return this.View();
		}

		[HttpPost]
		public async Task<ActionResult> GetData(FormCollection formCollection)
		{
			ViewBag.DevWebUrl = formCollection["devWebUrl"];
			ViewBag.AccessToken = formCollection["accessToken"];
			ViewBag.RefreshToken = formCollection["refreshToken"];

			try
			{
				var authorization = "Bearer " + ViewBag.AccessToken;
				var requestUrl = Convert.ToString(ViewBag.DevWebUrl) + formCollection["queryText"];

				using (var httpClient = new HttpClient())
				{
					httpClient.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
					httpClient.DefaultRequestHeaders.Add("Authorization", authorization);

					var response = await httpClient.GetAsync(new Uri(requestUrl));
					var result = await response.Content.ReadAsStringAsync();
					ViewBag.ResultData = result;
				}
			}
			catch (Exception ex)
			{
				ViewBag.ExceptionMessage = ex.Message;
			}

			return this.View();
		}
	}
}