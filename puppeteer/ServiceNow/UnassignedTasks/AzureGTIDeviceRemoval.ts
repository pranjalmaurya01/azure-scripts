import { cleanEnv, email, str } from 'envalid';
import { Page } from 'puppeteer';
import AzureAccountSelect from '../../AzureAccountSelect';
import getBrowser from '../getBrowser';

const env = cleanEnv(process.env, {
  AZURE_ADMIN_USERNAME: email(),
  AZURE_NAME: str(),
});

main();

async function main(page?: Page) {
  if (!page) {
    const pb = await getBrowser();
    if (!pb) return;
    page = pb.page;
  }

  try {
    await page.goto(
      'https://britishcouncil.service-now.com/task_list.do?sysparm_query=active%3Dtrue%5Eu_display_state%3D10%5Eassignment_group%3D74aa6cdfdb28e3403700ff361d961939%5EORassignment_group%3Df8aa6cdfdb28e3403700ff361d961937%5EORassignment_group%3Dc7fe2c4cdb425f4c3700ff361d96198a%5EORassignment_group%3D8e2f13e9db69e7441ce298f3db961942%5EORassignment_group%3Db08471e6db4d27c03700ff361d961960%5EORassignment_group%3D71ef28e1dbd5bb40d6219ee3db961957%5EORassignment_group%3D453a3d2edb4d27c03700ff361d96198f%5EORassignment_group%3Dfcaa24dfdb28e3403700ff361d9619a3%5EORassignment_group%3D7caa6cdfdb28e3403700ff361d96193f%5EORassignment_group%3D3ffc682ddb55bb40d6219ee3db961945%5EORassignment_group%3D7caa6cdfdb28e3403700ff361d961932%5EORassignment_group%3Dbcaa2cdfdb28e3403700ff361d9619f8%5EGOTOdescription%3DGTI%20Device%20Removal%20-%20Azure%20Portal%5Eassigned_toISEMPTY&sysparm_first_row=1&sysparm_view='
    );
    await AzureAccountSelect(page, env.AZURE_ADMIN_USERNAME);

    await assignTasks(page);
  } catch (err) {
    console.error(err);
  } finally {
    // await cleanup();
    // await browser?.disconnect();
    setTimeout(async () => {
      return await main(page);
    }, 10000);
  }
}

// sc_task.number
// sc_task.description
// sc_task.u_submitted_details || sys_original.sc_task.u_submitted_details

async function assignTasks(page: Page) {
  const taskLink = await page.$(
    'table#task_table tbody tr:not(.list2_no_records) a.linked.formlink'
  );
  if (!taskLink) return;
  await taskLink.click();
  try {
    const taskNo = await page
      .waitForSelector('input[name="sc_task.number"]')
      .then((e) =>
        e?.getProperty('value').then((e) => e.toString().split(':')[1])
      );
    const stateSelect = await page.$('select[name="sc_task.state"]');
    const assignedToInput = await page.$(
      'input[id="sys_display.sc_task.assigned_to"]'
    );
    const updateBtn = await page.$('button[id=sysverb_update]');

    if (assignedToInput && stateSelect && taskNo && updateBtn) {
      await stateSelect.type('Work in Progress');
      await assignedToInput.type(env.AZURE_NAME);
      await page.waitForNetworkIdle();
      await updateBtn.click();
      await page.waitForNetworkIdle();
      console.log(`${taskNo} : Assigned to ${env.AZURE_NAME}`);
    } else {
      console.log(`${taskNo} : something is wrong`);
    }
  } catch (e) {
    console.log(`ERROR : ${e}`);
  }
  return await assignTasks(page);
}
