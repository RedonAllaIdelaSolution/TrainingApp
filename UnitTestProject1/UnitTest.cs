using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TrainingApp.Controllers;

namespace UnitTestProject1
{
    [TestClass]
    public class UnitTest
    {
		[TestMethod]
		public void TestHomePage()
		{
			HomeController controller = new HomeController();
			ViewResult result = controller.Index() as ViewResult;
			Assert.AreEqual("Your application description page.", result.ViewData["Message"]);
		}
	}
}
