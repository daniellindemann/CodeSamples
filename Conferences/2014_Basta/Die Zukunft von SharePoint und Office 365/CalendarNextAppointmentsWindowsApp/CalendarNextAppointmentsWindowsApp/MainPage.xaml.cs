using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI;
using Windows.UI.Text;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238
using Microsoft.Office365.Exchange;

namespace CalendarNextAppointmentsWindowsApp
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();
        }

		private async void btnAppointments_Click(object sender, RoutedEventArgs e)
		{
			try
			{
				var events = await CalendarAPISample.GetCalendarEvents();
				listViewAppointments.Items.Clear();

				foreach (IEvent item in events)
				{
					listViewAppointments.Items.Add(new ListViewItem() { Content = item.Subject, FontSize = 32.0});
				}
			}
			catch (Exception ex)
			{
				var exItem = new ListViewItem()
				{
					Content = ex.Message,
					FontSize = 32.0,
					Foreground = new SolidColorBrush(Color.FromArgb(255,255,0,0))
				};
				listViewAppointments.Items.Add(exItem);
			}
		}

		private void btnClear_Click(object sender, RoutedEventArgs e)
		{
			listViewAppointments.Items.Clear();
		}

		private void btnLogout_Click(object sender, RoutedEventArgs e)
		{
			this.Logout();
		}

	    private async void Logout()
	    {
		    await CalendarAPISample.SignOut();
			listViewAppointments.Items.Clear();
	    }

		
    }

}
