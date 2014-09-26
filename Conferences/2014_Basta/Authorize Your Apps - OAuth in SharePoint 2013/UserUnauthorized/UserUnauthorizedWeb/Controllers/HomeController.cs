using Microsoft.Ajax.Utilities;
using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace UserUnauthorizedWeb.Controllers
{
	public class HomeController : Controller
	{
		[SharePointContextFilter]
		public ActionResult Index()
		{
			User spUser = null;

			var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

			using (var clientContext = spContext.CreateAppOnlyClientContextForSPAppWeb())
			{
				if (clientContext != null)
				{
					spUser = clientContext.Web.CurrentUser;

					clientContext.Load(spUser, user => user.Title);

					clientContext.ExecuteQuery();

					ViewBag.UserName = spUser.Title;
				}
			}

			return View();
		}

		[SharePointContextFilter]
		public ActionResult CreateList()
		{
			User spUser = null;

			var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);
			
			using (var clientContext = spContext.CreateAppOnlyClientContextForSPHost())
			{
				if (clientContext != null)
				{
					spUser = clientContext.Web.CurrentUser;

					clientContext.Load(spUser, user => user.Title);

					clientContext.ExecuteQuery();

					ViewBag.UserName = spUser.Title;
				}
			}

			return View();
		}

		[HttpPost]
		[SharePointContextFilter]
		public ActionResult CreateList(System.Web.Mvc.FormCollection formCollection)
		{
			User spUser = null;

			var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);
			using (var clientContext = spContext.CreateUserClientContextForSPHost())
			{
				if (clientContext != null)
				{
					var creationInfo = new ListCreationInformation();
					creationInfo.Title = formCollection["listName"];
					creationInfo.Url = formCollection["listUrl"].TrimStart('/');
					creationInfo.Description = formCollection["listDescription"];
					creationInfo.TemplateType = (int)ListTemplateType.GenericList;

					var web = clientContext.Web;
					var list = web.Lists.Add(creationInfo);
					clientContext.Load(list, l => l.DefaultViewUrl);
					
					try
					{
						clientContext.ExecuteQuery();

						var defaultViewUrl = new Uri(clientContext.Url).GetLeftPart(UriPartial.Authority) + list.DefaultViewUrl;
						ViewBag.SuccessMessage = "List created " + defaultViewUrl;
					}
					catch (Exception ex)
					{
						ViewBag.ExceptionMessage = ex.ToString();
					}
				}
			}

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
