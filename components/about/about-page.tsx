'use client';

import { motion } from 'motion/react';
import { Camera, Film, Monitor, Users, Award, Clock, Heart, Target } from 'lucide-react';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
};

const stats = [
    {
        number: '200+',
        label: 'Sự kiện đã thực hiện',
        description: 'Từ hội nghị doanh nghiệp đến sự kiện giải trí quy mô lớn',
    },
    {
        number: '50+',
        label: 'Đối tác tin tưởng',
        description: 'Doanh nghiệp, tổ chức và thương hiệu hợp tác lâu dài',
    },
    {
        number: '10+',
        label: 'Thành viên sáng tạo',
        description: 'Đội ngũ chuyên nghiệp, tận tâm và đầy nhiệt huyết',
    },
    {
        number: '3+',
        label: 'Năm kinh nghiệm',
        description: 'Không ngừng phát triển và nâng cao chất lượng dịch vụ',
    },
];

const services = [
    {
        icon: Camera,
        title: 'Chụp ảnh sự kiện',
        description: 'Ghi lại mọi khoảnh khắc đáng nhớ với chất lượng hình ảnh chuyên nghiệp',
    },
    {
        icon: Film,
        title: 'Quay phim sự kiện',
        description: 'Sản xuất video sự kiện chất lượng cao, từ quay phim đến hậu kỳ',
    },
    {
        icon: Monitor,
        title: 'Livestream chuyên nghiệp',
        description: 'Truyền phát trực tiếp đa nền tảng với hình ảnh và âm thanh sắc nét',
    },
];

const values = [
    {
        icon: Award,
        title: 'Chất lượng',
        description: 'Cam kết mang đến sản phẩm chất lượng cao nhất cho mọi dự án',
    },
    {
        icon: Clock,
        title: 'Đúng tiến độ',
        description: 'Luôn hoàn thành đúng thời hạn cam kết với khách hàng',
    },
    {
        icon: Heart,
        title: 'Tận tâm',
        description: 'Đặt sự hài lòng của khách hàng lên hàng đầu trong mọi dự án',
    },
    {
        icon: Target,
        title: 'Sáng tạo',
        description: 'Không ngừng đổi mới để mang đến những ý tưởng độc đáo',
    },
];

const AboutPage = () => {
    return (
        <div className="flex flex-col">
            {/* Section 1: Giới thiệu công ty */}
            <section className="layout-padding py-10 md:py-16 lg:py-20">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
                    {/* Text content */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInLeft}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="flex flex-1 flex-col gap-4 md:gap-6"
                    >
                        <span className="text-primary text-2xl font-bold sm:text-3xl lg:text-4xl">
                            Về F.Production
                        </span>
                        <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80 md:text-base lg:text-lg">
                            <p>
                                <span className="text-primary font-semibold">F.Production</span> là đơn vị chuyên cung cấp dịch vụ quay phim, chụp ảnh và livestream sự kiện chuyên nghiệp.
                                Chúng tôi tự hào mang đến những sản phẩm chất lượng cao, đáp ứng mọi nhu cầu truyền thông của doanh nghiệp và tổ chức.
                            </p>
                            <p>
                                Với đội ngũ nhân sự giàu kinh nghiệm và trang thiết bị hiện đại, F.Production cam kết
                                mang đến những sản phẩm hình ảnh và video đẳng cấp, góp phần nâng tầm thương hiệu cho khách hàng.
                            </p>
                        </div>
                    </motion.div>

                    {/* Image placeholder */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInRight}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                        className="flex flex-1 items-center justify-center"
                    >
                        <div className="bg-background-secondary flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-border">
                            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                <Camera className="size-12 opacity-40" />
                                <span className="text-sm opacity-60">Ảnh giới thiệu</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Các con số */}
            <section className="bg-background-secondary layout-padding py-10 md:py-16 lg:py-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mx-auto max-w-6xl"
                >
                    <h2 className="text-primary mb-8 text-center text-2xl font-bold italic sm:text-3xl lg:mb-12 lg:text-4xl">
                        Các con số
                    </h2>
                    <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4 lg:gap-10">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.5 }}
                                variants={fadeInUp}
                                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.15 }}
                                className="flex flex-col items-center gap-2 text-center"
                            >
                                <span className="text-primary text-4xl font-bold sm:text-5xl lg:text-6xl">
                                    {stat.number}
                                </span>
                                <span className="text-foreground text-sm font-semibold sm:text-base lg:text-lg">
                                    {stat.label}
                                </span>
                                <p className="text-foreground/60 text-xs sm:text-sm">
                                    {stat.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Section 3: Dịch vụ nổi bật */}
            <section className="layout-padding py-10 md:py-16 lg:py-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mx-auto max-w-6xl"
                >
                    <h2 className="text-primary mb-8 text-center text-2xl font-bold sm:text-3xl lg:mb-12 lg:text-4xl">
                        Dịch vụ nổi bật
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={service.title}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.5 }}
                                    variants={fadeInUp}
                                    transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.15 }}
                                    whileHover={{ y: -6, transition: { duration: 0.3 } }}
                                    className="bg-background-secondary group flex flex-col items-center gap-4 rounded-2xl p-6 md:p-8"
                                >
                                    <div className="bg-foreground group-hover:bg-primary flex size-14 items-center justify-center rounded-full transition-colors duration-300 sm:size-16">
                                        <Icon className="text-background size-7 sm:size-8" />
                                    </div>
                                    <span className="text-foreground group-hover:text-primary text-center text-lg font-bold transition-colors duration-300">
                                        {service.title}
                                    </span>
                                    <p className="text-foreground/70 text-center text-sm md:text-base">
                                        {service.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </section>

            {/* Section 4: Giá trị cốt lõi */}
            <section className="bg-background-secondary layout-padding py-10 md:py-16 lg:py-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mx-auto max-w-6xl"
                >
                    <h2 className="text-primary mb-8 text-center text-2xl font-bold sm:text-3xl lg:mb-12 lg:text-4xl">
                        Giá trị cốt lõi
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={value.title}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.5 }}
                                    variants={fadeInUp}
                                    transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                                    className="flex flex-col items-center gap-3 text-center"
                                >
                                    <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full sm:size-18">
                                        <Icon className="text-primary size-8 sm:size-9" />
                                    </div>
                                    <span className="text-foreground text-lg font-bold">
                                        {value.title}
                                    </span>
                                    <p className="text-foreground/60 text-sm md:text-base">
                                        {value.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </section>

            {/* Section 5: Image placeholder thứ hai */}
            <section className="layout-padding py-10 md:py-16 lg:py-20">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInLeft}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="flex flex-1 items-center justify-center"
                    >
                        <div className="bg-background-secondary flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-border">
                            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                <Users className="size-12 opacity-40" />
                                <span className="text-sm opacity-60">Ảnh đội ngũ</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInRight}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                        className="flex flex-1 flex-col gap-4 md:gap-6"
                    >
                        <span className="text-primary text-2xl font-bold sm:text-3xl lg:text-4xl">
                            Đội ngũ của chúng tôi
                        </span>
                        <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80 md:text-base lg:text-lg">
                            <p>
                                Đội ngũ F.Production gồm những bạn trẻ đam mê sáng tạo, giàu nhiệt huyết
                                và luôn không ngừng học hỏi để nâng cao năng lực chuyên môn.
                            </p>
                            <p>
                                Chúng tôi tin rằng sự kết hợp giữa kỹ năng chuyên môn và tinh thần đồng đội
                                là chìa khóa tạo nên những sản phẩm xuất sắc cho khách hàng.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
