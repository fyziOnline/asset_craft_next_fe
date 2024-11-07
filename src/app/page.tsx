import Accordion from "@/components/global/Accordion";

export default function Home() {
  return (
    <div className="flex items-center justify-center gap-2 w-full h-screen flex-col">
      <Accordion HeaderTitle="Campaign Overview">
        <p>This is the Campaign Overview content. You can add more details here.</p>
        <ul>
          <li>Overview of campaign goals</li>
          <li>Target audience</li>
          <li>Key performance indicators</li>
        </ul>
      </Accordion>

      <Accordion HeaderTitle="Email - Key Messages & Content">
        <p>This section contains the key messages for the email campaign.</p>
        <ul>
          <li>Message 1: Welcome to our new product!</li>
          <li>Message 2: Get 20% off your first purchase</li>
          <li>Message 3: Exclusive offer just for you</li>
        </ul>
      </Accordion>

      <Accordion HeaderTitle="Additional Campaign Assets">
        <p>This section lists additional assets required for the campaign.</p>
        <ul>
          <li>Landing page design</li>
          <li>Social media graphics</li>
          <li>Email templates</li>
        </ul>
      </Accordion>

      <Accordion HeaderTitle="Content Structuring for Communication">
        <p>This section outlines how to structure the content for effective communication.</p>
        <ul>
          <li>Clear and concise subject lines</li>
          <li>Engaging content with a call to action</li>
          <li>Personalized messaging based on user segments</li>
        </ul>
      </Accordion>
    </div>
  );
}
