"use strict";

const Firestore = use("App/Models/Firestore");
const { validate } = use("Validator");
const firestore = new Firestore();
const db = firestore.db();
const noticeReference = db.collection("notice");

class NoticeController {
  async create({ request, response }) {
    const rules = {
      writer: "required",
      title: "required",
    };

    const data = request.only(["writer", "title", "used"]);
    const validation = await validate(data, rules);
    if (validation.fails()) {
      return response.status(206).json({
        status: false,
        message: validation.messages()[0].message,
        data: null,
      });
    }
    let create = await noticeReference.add({
      writer: data.writer,
      title: data.title,
      used: data.used ? 1 : 0,
    });
    if (create) {
      return response.status(201).json({
        status: true,
        message: "User created successfully",
        data: null,
      });
    }
  }
  async list({ request, response }) {
    let notices = [];
    // reference (collection) -> where -> then(snapshot => {})
    // reference (collection) -> doc('id') -> get()
    await noticeReference.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let id = doc.id;
        let notice = doc.data();
        notices.push({
          id,
          ...notice,
        });
      });
    });

    return response.status(201).json({
      status: true,
      message: "User created successfully",
      data: notices,
    });
  }
}

module.exports = NoticeController;
