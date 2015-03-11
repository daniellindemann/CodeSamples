using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using ManualOAuthApp.Models;
using Newtonsoft.Json;

namespace ManualOAuthApp.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			return View();
		}

		public ActionResult RedirectAuthorization()
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
		public ActionResult RedirectAuthorization(FormCollection formCollection)
		{
			var postData = "grant_type=" + formCollection["manualGrantType"] +
								"&code=" + formCollection["manualAuthCode"] +
								"&redirect_uri=" + Server.UrlEncode(formCollection["redirectUri"]) +
								"&client_id=" + formCollection["manualClientId"] +
								"&client_secret=" + Server.UrlEncode(formCollection["manualClientSecret"]) +
								"&resource=" + formCollection["manualResource"];

			// build request
			HttpWebRequest webRequest = WebRequest.CreateHttp(formCollection["tokenUrl"]);
			webRequest.ContentType = "application/x-www-form-urlencoded";
			webRequest.ContentLength = postData.Length;
			webRequest.Method = "POST";
			using (var requestStream = webRequest.GetRequestStream())
				requestStream.Write(Encoding.UTF8.GetBytes(postData), 0, postData.Length);

			// get response
			var reponse = webRequest.GetResponse() as HttpWebResponse;
			string responseData = null;
			using (var responseStream = reponse.GetResponseStream())
			using (var responseStreamReader = new StreamReader(responseStream))
				responseData = responseStreamReader.ReadToEnd();

			var accessTokenResponse = JsonConvert.DeserializeObject<dynamic>(responseData);
			TempData["AccessTokenData"] = new AccessTokenData()
			{
				TokenType = accessTokenResponse.token_type,
				Scope = accessTokenResponse.scope,
				AccessToken = accessTokenResponse.access_token
			};

			return RedirectToAction("GetData");
		}

		public ActionResult GetData()
		{
         var accessTokenData = TempData["AccessTokenData"] as AccessTokenData;

			return View(accessTokenData);
		}

		[HttpPost]
		public ActionResult GetData(FormCollection formCollection)
		{
			var authorization = formCollection["tokenType"] + " " + formCollection["accessToken"];
			var requestUrl = formCollection["endPointUrl"] + formCollection["queryText"];

			// build request
			HttpWebRequest webRequest = WebRequest.CreateHttp(requestUrl);
			webRequest.Headers.Add("Authorization", authorization);
			var reponse = webRequest.GetResponse() as HttpWebResponse;
			string responseData = string.Empty;
			using (var responseStream = reponse.GetResponseStream())
			using (var responseStreamReader = new StreamReader(responseStream))
				responseData = responseStreamReader.ReadToEnd();

			ViewBag.ResultData = responseData;

			var accessTokenData = new AccessTokenData()
			{
				TokenType = formCollection["tokenType"],
				Scope = formCollection["scope"],
				AccessToken = formCollection["accessToken"]
			};
			TempData["AccessTokenData"] = accessTokenData;

			return View(accessTokenData);
		}

		public ActionResult PostData()
		{
			var accessTokenData = TempData["AccessTokenData"] as AccessTokenData;

			return View(accessTokenData);
		}

		[HttpPost]
		public ActionResult PostData(FormCollection formCollection)
		{
			var authorization = formCollection["tokenType"] + " " + formCollection["accessToken"];
			var requestUrl = formCollection["endPointUrl"] + formCollection["queryText"];
			var postData = formCollection["querydata"].Replace(Environment.NewLine, string.Empty).Replace("\t", string.Empty).Trim();

			// build request
			HttpWebRequest webRequest = WebRequest.CreateHttp(requestUrl);
			webRequest.Headers.Add("Authorization", authorization);
			webRequest.ContentType = "application/json; charset=utf-8";
         webRequest.ContentLength = postData.Length;
			webRequest.Method = "POST";
			using (var requestStream = webRequest.GetRequestStream())
				requestStream.Write(Encoding.UTF8.GetBytes(postData), 0, postData.Length);

			// get response
			var reponse = webRequest.GetResponse() as HttpWebResponse;
			string responseData = null;
			using (var responseStream = reponse.GetResponseStream())
			using (var responseStreamReader = new StreamReader(responseStream))
				responseData = responseStreamReader.ReadToEnd();

			ViewBag.ResultData = responseData;

			var accessTokenData = new AccessTokenData()
			{
				TokenType = formCollection["tokenType"],
				Scope = formCollection["scope"],
				AccessToken = formCollection["accessToken"]
			};
			TempData["AccessTokenData"] = accessTokenData;

			return View(accessTokenData);
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