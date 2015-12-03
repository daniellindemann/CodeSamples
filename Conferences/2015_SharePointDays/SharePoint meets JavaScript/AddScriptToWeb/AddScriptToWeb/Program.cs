using System;
using System.Linq;
using System.Security;
using System.Text;
using Microsoft.SharePoint.Client;

namespace AddScriptToWeb
{
	class Program
	{
		private static void Main(string[] args)
		{
			Console.Write("Enter web url: ");
			var webUrl = ConsoleHelper.ConsoleReadLineWithDefault("https://dlindemann.sharepoint.com/sites/publishing/spdays0x");

			var ctx = new ClientContext(webUrl);

			// ask for credentials
			Console.Write("Username: ");
			var username = Console.ReadLine();
			Console.Write("Password: ");
			var password = ConsoleHelper.ReadPassword();
			ctx.Credentials = new SharePointOnlineCredentials(username, password.ToSecureString());
			Console.WriteLine();

			var cc = new ConsoleChoice("Add or remove init script reference?",
				new ConsoleChoiceOption() { Key = 'a', Text = "Add" },
				new ConsoleChoiceOption() { Key = 'r', Text = "Remove" });
			cc.Write();

			if (cc.Answer == 'a')
			{
				Console.Write("Enter js file url: ");
				var jsUrl = Console.ReadLine();

				if(ctx.Web.AddJsLink("appInit", jsUrl))
					Console.WriteLine("Script reference added");
				else
					Console.WriteLine("Error on adding script reference");
			}
			if (cc.Answer == 'r')
			{
				if(ctx.Web.DeleteJsLink("appInit"))
					Console.WriteLine("Script reference removed");
				else
					Console.WriteLine("Error on removing script reference");
			}			

			if (ctx.HasPendingRequest)
				ctx.ExecuteQuery();
		}
	}

	#region Helper n stuff

	public static class ConsoleHelper
	{
		public static string ReadPassword()
		{
			var stringBuilder = new StringBuilder();
			while (true)
			{
				ConsoleKeyInfo i = Console.ReadKey(true);
				if (i.Key == ConsoleKey.Enter)
					break;
				if (i.Key == ConsoleKey.Backspace)
				{
					if (stringBuilder.Length > 0)
					{
						stringBuilder.Remove(stringBuilder.Length - 1, 1);
						Console.Write("\b \b");
					}
				}
				else
				{
					stringBuilder.Append(i.KeyChar);
					Console.Write("*");
				}
			}
			return stringBuilder.ToString();
		}

		public static string ConsoleReadLineWithDefault(string defaultValue)
		{
			System.Windows.Forms.SendKeys.SendWait(defaultValue);
			return Console.ReadLine();
		}
	}

	public static class StringExtensions
	{
		public static SecureString ToSecureString(this string s)
		{
			var secureString = new SecureString();
			foreach (char c in s)
			{
				secureString.AppendChar(c);
			}
			return secureString;
		}
	}

	public class ConsoleChoiceOption
	{
		public char Key { get; set; }
		public string Text { get; set; }
	}

	public class ConsoleChoice
	{
		private readonly string _demandQuestion;
		private readonly bool _retryOnUnsupportedAnser;
		private readonly ConsoleChoiceOption[] _choiceOptions;

		public ConsoleChoice(string demandQuestion, bool retryOnUnsupportedAnser, params ConsoleChoiceOption[] choiceOptions)
		{
			_demandQuestion = demandQuestion;
			_retryOnUnsupportedAnser = retryOnUnsupportedAnser;
			_choiceOptions = choiceOptions;
		}

		public ConsoleChoice(string demandQuestion, params ConsoleChoiceOption[] choiceOptions) : this(demandQuestion, true, choiceOptions)
		{
		}

		public string SelectionText { get; set; }

		public char Answer { get; private set; }

		public void Write()
		{
			var retry = _retryOnUnsupportedAnser;

			do
			{
				Console.WriteLine(_demandQuestion);
				foreach (var consoleChoiceOption in _choiceOptions)
				{
					Console.WriteLine($"[{consoleChoiceOption.Key}] {consoleChoiceOption.Text}");
				}
				Console.Write(SelectionText ?? "Please select: ");
				var selection = Console.ReadKey();
				Answer = selection.KeyChar;
				Console.WriteLine();

				if (_choiceOptions.Select(co => co.Key).Any(c => c == Answer))
					retry = false;
				else
					Console.WriteLine("Answer not supported. Retry ...");
			} while (retry);
		}
	}

	#endregion
}
