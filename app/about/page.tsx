import Link from "next/link";
import { 
  Palette, 
  Users, 
  Zap, 
  Lock, 
  Cloud, 
  MousePointer2,
  ArrowRight
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-primary-black text-white">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]" />
        
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl mb-6">
            <span className="text-primary-green">FigPro</span> - 协作设计工具
          </h1>
          <p className="text-xl text-primary-grey-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            为现代团队打造的强大实时协作设计平台。
            一起创建、设计和迭代，享受无缝的实时协作体验。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-primary-black bg-primary-green rounded-lg hover:bg-primary-green/90 transition-all duration-200"
            >
              开始设计
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white border border-primary-grey-300 rounded-lg hover:bg-primary-grey-200 transition-all duration-200"
            >
              查看 GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 lg:px-8 bg-primary-grey-100/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">强大功能</h2>
            <p className="text-lg text-primary-grey-300 max-w-2xl mx-auto">
              您需要的一切，让设计创意变为现实
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "实时协作",
                description: "与团队实时协作。即时查看光标、评论和更改。"
              },
              {
                icon: Palette,
                title: "丰富的绘图工具",
                description: "使用我们直观的画布编辑器创建形状、线条和手绘。"
              },
              {
                icon: Cloud,
                title: "云端存储",
                description: "您的设计会自动保存并在所有设备间同步。"
              },
              {
                icon: Lock,
                title: "安全私密",
                description: "企业级安全，为您的设计数据提供端到端加密。"
              },
              {
                icon: Zap,
                title: "极速响应",
                description: "专为性能打造。即使处理复杂设计也能流畅交互。"
              },
              {
                icon: MousePointer2,
                title: "直观界面",
                description: "简洁现代的界面，让您专注于最重要的事情——您的设计。"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-primary-grey-200 hover:bg-primary-grey-200/80 transition-all duration-200 border border-primary-grey-100"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-green/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-primary-grey-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">现代技术构建</h2>
            <p className="text-lg text-primary-grey-300 max-w-2xl mx-auto">
              采用最新技术打造，实现最佳性能
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Next.js 16",
              "React 19",
              "TypeScript",
              "Tailwind CSS",
              "Fabric.js",
              "Liveblocks",
              "shadcn/ui",
              "Lucide Icons"
            ].map((tech, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-primary-grey-100 text-center border border-primary-grey-200 hover:border-primary-green/50 transition-all duration-200"
              >
                <span className="font-medium text-primary-grey-300">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:px-8 bg-linear-to-b from-primary-grey-100/50 to-primary-black">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">准备好开始创作了吗？</h2>
          <p className="text-lg text-primary-grey-300 mb-10 max-w-2xl mx-auto">
            加入数千名设计师的行列，使用 FigPro 将创意变为现实。
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-primary-black bg-primary-green rounded-lg hover:bg-primary-green/90 transition-all duration-200"
          >
            免费开始使用
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 lg:px-8 border-t border-primary-grey-200">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-grey-300">
            © 2024 FigPro. 为设计师而建，用 ❤️ 打造。
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-primary-grey-300 hover:text-white transition-colors">
              隐私政策
            </Link>
            <Link href="#" className="text-sm text-primary-grey-300 hover:text-white transition-colors">
              服务条款
            </Link>
            <Link href="#" className="text-sm text-primary-grey-300 hover:text-white transition-colors">
              联系我们
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
