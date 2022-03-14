export const ReminderEmail = ({ text }: { text: string }) =>
  `
<div style = "padding: 10px 30px; width: 66%; margin: auto; min-width: 600px;">
  <div style = "font-size: 18px; font-family: Roboto;">
    <p>
      ${text}
    </p>
    <br/>
    <p style = "margin-bottom: 0;">Warm Regards,</p>
    <p style = "margin-top: 0;">FRAME.xyz Team</p>
  </div>
</div>
`;

export default ReminderEmail;
