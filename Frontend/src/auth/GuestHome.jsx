import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";

const templates = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean card-based layout with project filtering',
    image: 'https://cdn.dribbble.com/userupload/31670851/file/original-beaa8e9898aae5b41a8f498bb16e919c.png?resize=1200x799&vertical=center',
    enabled: true
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple single-column layout focused on content',
    image: 'https://cdn.dribbble.com/userupload/42342196/file/original-e6d784ce9be3970d08187be9a1a845af.png?resize=1200x900&vertical=center',
    enabled: false
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Modern layout with project showcases and detailed views',
    image: 'https://cdn.dribbble.com/userupload/24856091/file/original-7029f79343f21d6f55d9628cc0a840c5.jpg?resize=1504x1128&vertical=center',
    enabled: false
  }
];
export default function Guest() {
  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-2xl text-center justify-center">
          <span className={title()}>Let Your Work Speak For Itself&nbsp;</span> <br />
<br />          <span className={title({ color: "violet" })}>“myportfolify”&nbsp;</span>
          <br /> <br />
           
          <div className={subtitle({ class: "mt-4" })}>
            myportfolify makes it effortless to create a professional showcase of your work with ready-to-use templates..
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href="/login"
          >
            Get Started
          </Link>
          <Link
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href="#templates"
          >
            View Templates
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={subtitle({ class: "mb-2" })}>Key Features</h2>
          <p className={title({ size: "sm" })}>
            Everything you need for a professional online presence
          </p>
        </div>
<br />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 max-w-6xl mx-auto">
          {[
            {
              title: "One-Click Portfolio",
              description: "Generate a beautiful portfolio profile in minutes",
              icon: "🚀"
            },
            {
              title: "Three-Layer Themes",
              description: "Professionally designed for all industries",
              icon: "🎨"
            },
            {
              title: "Custom Profile",
              description: "myportfolify.vercel.app/YourName",
              icon: "🌐"
            }

          ].map((feature, index) => (
            <Card key={index} isHoverable className="h-full">
              <CardHeader>
                <div className="text-3xl">{feature.icon}</div>
              </CardHeader>
              <CardBody>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-default-500 mt-2">{feature.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

{/* Templates Section */}
<section id="templates" className="py-8 md:py-12 bg-default-50">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className={subtitle({ class: "mb-2" })}>Our Templates</h2>
    <p className={title({ size: "sm" })}>
       Designs tailored for your profession
    </p>
  </div>
  <br />
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
    {templates.map((template) => (
      <Card key={template.id} isPressable className="h-full transition-transform hover:scale-[1.02]">
        <CardBody className="p-0 overflow-hidden">
          <Image
            alt={template.name}
            className="object-cover w-full h-[160px]"
            src={template.image}
            width={400}
            height={160}
          />
          {!template.enabled && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Coming Soon</span>
            </div>
          )}
        </CardBody>
        <CardFooter className="flex-col items-start p-4">
          <h3 className="text-md font-bold">{template.name}</h3>
          <p className="text-default-500 text-sm">{template.description}</p>
          <p className="text-xs text-default-400 mt-1">
            {template.enabled ? "Available Now" : "Coming Soon"}
          </p>
        </CardFooter>
      </Card>
    ))}
  </div>
</section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-violet-500 to-fuchsia-500">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={title({ color: "white", size: "sm" })}>
            Ready to build your portfolio?
          </h2>
          <p className={subtitle({ color: "white", class: "mt-2" })}>
            Join myportfolify for easy build!
          </p>
          <div className="mt-6">
            <Link
              className={buttonStyles({
                color: "crimson",
                radius: "full",
                variant: "shadow",
                size: "lg",
              })}
              href="/login"
            >
              Get Started For Free
            </Link>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}