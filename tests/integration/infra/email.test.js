import email from "infra/email";
import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: '"Curso Dev" <contato@curso.dev>',
      to: "suporte@curso.dev",
      subject: "Test email",
      text: "This is a test email.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.id).toBe(1);
    expect(lastEmail.sender).toBe("<contato@curso.dev>");
    expect(lastEmail.subject).toBe("Test email");
    expect(lastEmail.recipients[0]).toBe("<suporte@curso.dev>");
    expect(lastEmail.text).toBe("This is a test email.\n");
  });
});
