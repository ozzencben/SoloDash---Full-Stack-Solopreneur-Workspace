import { v2 as cloudinary } from "cloudinary";
import prisma from "../../db.js"; // Prisma istemcinin yolu [cite: 1]
// Cloudinary Yapılandırması
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
export const updateAvatar = async (req, res) => {
    try {
        console.log("Gelen Kullanıcı Verisi:", req.user); // Terminalden kontrol et
        const rawUserId = req.user?.userId;
        const fileStr = req.body.data; // Frontend'den gelen base64 veri
        if (!rawUserId) {
            return res
                .status(401)
                .json({ error: "Yetkisiz erişim: Kullanıcı ID bulunamadı" });
        }
        if (!fileStr) {
            return res.status(400).json({ error: "Resim verisi gönderilmedi" });
        }
        // Prisma şemanda id Int olduğu için sayıya çeviriyoruz
        const userId = Number(rawUserId);
        // 1. Mevcut kullanıcıyı Prisma ile getir
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!currentUser) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        }
        // 2. Eğer eski bir resmi varsa Cloudinary'den sil
        // Bu sayede Cloudinary'de dosya yığını oluşmasını engelliyoruz
        if (currentUser.avatarUrl && currentUser.avatarUrl.includes("cloudinary")) {
            try {
                // URL'den public_id'yi ayıklıyoruz (Örn: avatars/user_123_456)
                const urlParts = currentUser.avatarUrl.split("/");
                const fileNameWithExtension = urlParts[urlParts.length - 1];
                const publicId = fileNameWithExtension.split(".")[0];
                // Klasör ismiyle birlikte siliyoruz
                await cloudinary.uploader.destroy(`avatars/${publicId}`);
            }
            catch (deleteError) {
                console.error("Eski resim silinirken hata oluştu (Devam ediliyor):", deleteError);
            }
        }
        // 3. Yeni resmi Cloudinary'ye yükle
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: "solopreneur_uploads",
            folder: "avatars",
            resource_type: "image",
        });
        // 4. Veritabanını Prisma ile GÜNCELLE [cite: 1]
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                avatarUrl: uploadResponse.secure_url,
            },
        });
        // Başarılı yanıt dön
        return res.status(200).json({
            success: true,
            message: "Profil resmi başarıyla güncellendi",
            avatarUrl: updatedUser.avatarUrl,
        });
    }
    catch (error) {
        console.error("Avatar Update Error:", error);
        return res
            .status(500)
            .json({ error: "Sunucu hatası: Profil resmi güncellenemedi" });
    }
};
//# sourceMappingURL=userController.js.map