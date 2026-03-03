'use client';

import { motion } from 'motion/react';
import { Building2, Mail, Phone, Users } from 'lucide-react';
import { services } from '@/lib/services-data';

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
        number: '30+',
        label: 'Thành viên',
        description: 'Đội ngũ chuyên nghiệp, sáng tạo và tận tâm trong từng dự án',
    },
    {
        number: '5+',
        label: 'Năm kinh nghiệm',
        description: 'Không ngừng phát triển để nâng cao chất lượng dịch vụ và trải nghiệm khách hàng',
    },
];

const AboutPage = () => {
    return (
        <div className="flex flex-col">
            {/* Section 1: Giới thiệu + thông tin chung — bg-background */}
            <section className="layout-padding py-10 md:py-16 lg:py-20">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInLeft}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="flex flex-1 flex-col gap-4 md:gap-6"
                    >
                        <div>
                            <span className="text-primary text-2xl font-bold sm:text-3xl lg:text-4xl">
                                GIỚI THIỆU F PRODUCTION
                            </span>
                            <div className="mt-3 h-1 w-14 rounded-full bg-primary" />
                        </div>
                        <div className="text-background-secondary/85 flex flex-col gap-3 text-sm leading-relaxed md:text-base lg:text-lg">
                            <p>
                                Công ty Cổ phần Truyền thông Hình ảnh F Production là đơn vị chuyên cung cấp dịch vụ sản xuất hình ảnh và video sự kiện chuyên nghiệp, phục vụ hoạt động truyền thông và quảng bá thương hiệu cho doanh nghiệp, tổ chức và tập đoàn trên toàn quốc.
                            </p>
                            <p>
                                Với phương châm chất lượng - chuyên nghiệp - tận tâm, chúng tôi không ngừng nỗ lực mang đến những trải nghiệm tốt nhất cho khách hàng thông qua sản phẩm chỉn chu và dịch vụ chu đáo. F Production tự hào là đối tác đáng tin cậy của nhiều thương hiệu lớn cùng nhiều tổ chức, doanh nghiệp uy tín khác trên thị trường.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInRight}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                        className="flex flex-1"
                    >
                        <div className="bg-background-secondary w-full rounded-2xl border border-border p-6 md:p-8">
                            <span className="text-primary mb-6 block text-xl font-bold md:text-2xl">
                                Thông tin chung doanh nghiệp
                            </span>
                            <div className="flex flex-col gap-5">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-xl">
                                        <Building2 className="text-primary size-5" />
                                    </div>
                                    <div className="text-sm leading-relaxed text-foreground/80 md:text-base">
                                        <p className="text-foreground font-semibold">Tên doanh nghiệp</p>
                                        <p>Công ty Cổ phần Truyền thông Hình ảnh F Production</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-xl">
                                        <Phone className="text-primary size-5" />
                                    </div>
                                    <div className="text-sm leading-relaxed text-foreground/80 md:text-base">
                                        <p className="text-foreground font-semibold">Hotline</p>
                                        <p>078.6969.888</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-xl">
                                        <Mail className="text-primary size-5" />
                                    </div>
                                    <div className="text-sm leading-relaxed text-foreground/80 md:text-base">
                                        <p className="text-foreground font-semibold">Email</p>
                                        <p>fproduction.work@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Kết nối giá trị — bg-background-secondary */}
            <section className="bg-background-secondary layout-padding py-10 md:py-16 lg:py-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center md:gap-6"
                >
                    <div className="flex flex-col items-center gap-3">
                        <h2 className="text-primary text-2xl font-bold sm:text-3xl lg:text-4xl">
                            KẾT NỐI GIÁ TRỊ
                        </h2>
                        <div className="h-1 w-14 rounded-full bg-primary" />
                    </div>
                    <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80 md:text-base lg:text-lg">
                        <p>
                            F Production luôn kiên định với mục tiêu mang đến các sản phẩm hình ảnh, video và dịch vụ sự kiện chất lượng cao, cùng dịch vụ khách hàng tận tâm và chuyên nghiệp.
                        </p>
                        <p>
                            Chúng tôi mong muốn không chỉ tạo ra giá trị cho khách hàng mà còn góp phần thúc đẩy sự phát triển của ngành truyền thông - sự kiện tại Việt Nam, thông qua từng dự án được thực hiện bằng niềm đam mê và tinh thần trách nhiệm.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Section 3: Dịch vụ — bg-background */}
            <section className="layout-padding py-10 md:py-16 lg:py-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mx-auto max-w-6xl"
                >
                    <div className="mb-8 flex flex-col items-center gap-3 lg:mb-12">
                        <h2 className="text-primary text-center text-2xl font-bold sm:text-3xl lg:text-4xl">
                            DỊCH VỤ
                        </h2>
                        <div className="h-1 w-14 rounded-full bg-primary" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={service.slug}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={fadeInUp}
                                    transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
                                    className="bg-background-secondary border-border flex items-center gap-4 rounded-2xl border p-5 md:p-6"
                                >
                                    <div className="bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-xl">
                                        <Icon className="text-primary size-5" />
                                    </div>
                                    <span className="text-foreground text-base font-semibold md:text-lg">
                                        {service.label}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </section>

            {/* Section 4: Các con số — bg-background-secondary */}
            <section className="bg-background-secondary layout-padding py-10 md:py-16 lg:py-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mx-auto max-w-4xl"
                >
                    <div className="mb-8 flex flex-col items-center gap-3 lg:mb-12">
                        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl">
                            <Users className="text-primary size-6" />
                        </div>
                        <h2 className="text-primary text-center text-2xl font-bold sm:text-3xl lg:text-4xl">
                            CON SỐ CỦA CHÚNG TÔI
                        </h2>
                        <div className="h-1 w-14 rounded-full bg-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 md:gap-10">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.5 }}
                                variants={fadeInUp}
                                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.15 }}
                                className="bg-background flex flex-col items-center rounded-2xl border border-border p-6 text-center md:p-8"
                            >
                                <span className="text-primary text-5xl font-bold md:text-6xl lg:text-7xl">
                                    {stat.number}
                                </span>
                                <span className="text-foreground mt-2 text-lg font-semibold md:text-xl">
                                    {stat.label}
                                </span>
                                <p className="text-foreground/75 mt-2 text-sm md:text-base">
                                    {stat.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Section 5: Tầm nhìn & Sứ mệnh — bg-background (khác footer bg-background-secondary) */}
            <section className="layout-padding py-10 md:py-16 lg:py-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mx-auto max-w-6xl"
                >
                    <div className="mb-8 flex flex-col items-center gap-3 lg:mb-12">
                        <h2 className="text-primary text-center text-2xl font-bold sm:text-3xl lg:text-4xl">
                            TẦM NHÌN & SỨ MỆNH
                        </h2>
                        <div className="h-1 w-14 rounded-full bg-primary" />
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            variants={fadeInLeft}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="bg-background-secondary rounded-2xl border border-border p-6 md:p-8"
                        >
                            <h3 className="text-primary mb-4 text-xl font-bold md:text-2xl">Tầm nhìn</h3>
                            <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80 md:text-base">
                                <p>
                                    F Production hướng đến mục tiêu trở thành thương hiệu hàng đầu Việt Nam trong lĩnh vực truyền thông sự kiện và sáng tạo nội dung hình ảnh.
                                </p>
                                <p>
                                    Chúng tôi không chỉ tập trung tạo ra những sản phẩm chất lượng, mà còn xây dựng một môi trường làm việc chuyên nghiệp, sáng tạo, nơi mỗi thành viên có thể phát huy tối đa năng lực và cống hiến để nâng tầm giá trị thương hiệu cho doanh nghiệp với chi phí tối ưu nhất.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            variants={fadeInRight}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                            className="bg-background-secondary rounded-2xl border border-border p-6 md:p-8"
                        >
                            <h3 className="text-primary mb-4 text-xl font-bold md:text-2xl">Sứ mệnh</h3>
                            <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80 md:text-base">
                                <p>
                                    F Production cam kết mang đến dịch vụ quay phim, chụp ảnh sự kiện và sản xuất phim doanh nghiệp chuyên nghiệp, sáng tạo và chất lượng cao.
                                </p>
                                <p>
                                    Chúng tôi giúp khách hàng lưu giữ khoảnh khắc, kể câu chuyện thương hiệu bằng hình ảnh chân thực và sống động, từ đó tạo dựng giá trị bền vững cho doanh nghiệp và cộng đồng.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default AboutPage;
