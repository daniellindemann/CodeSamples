using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.Office365.OAuth;

namespace CalendarNextAppointments.Controllers
{
	public class HomeController : Controller
	{
		public async Task<ActionResult> Index()
		{
			try
			{
				var events = await CalendarAPISample.GetCalendarEvents();
				return this.View(events);
			}
			catch (RedirectRequiredException rrex)
			{
				var redirectUrl = rrex.RedirectUri.ToString();
				return this.Redirect(redirectUrl);
			}
		}

		public ActionResult Logout()
		{
			var loggedOutUrl = string.Format("{0}{1}",
				this.Request.Url.GetLeftPart(UriPartial.Authority),
				Url.Action("LoggedOut"));
			var logoutUri = CalendarAPISample.SignOut(loggedOutUrl);

			return this.Redirect(logoutUri.ToString());
		}

		public ActionResult LoggedOut()
		{
			return this.View();
		}
	}
}