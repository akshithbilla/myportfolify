import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";

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
           
        </div>
<br />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
          {[
            {
              name: "Modern Minimalist",
              description: "Clean and elegant design",
              category: "All Professions"
            },
            {
              name: "Creative Showcase",
              description: "Perfect for designers",
              category: "Creative Fields"
            },
            {
              name: "Bold Professional",
              description: "Strong executive presence",
              category: "Business"
            }
          ].map((template, index) => (
            <Card key={index} isPressable className="h-full">
              <CardBody className="p-0">
                <Image
                  alt={template.name}
                  className="object-cover"
                  height={240}
                  src={`https://source.unsplash.com/random/600x400/?portfolio,design${index}`}
                  width="100%"
                />
              </CardBody>
              <CardFooter className="flex-col items-start">
                <h3 className="text-lg font-bold">{template.name}</h3>
                <p className="text-default-500">{template.description}</p>
                <p className="text-small text-default-400 mt-2">{template.category}</p>
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